import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const PROJECT_ID = 'gd-firestore-rules-test';
const rulesPath = fileURLToPath(new URL('../firestore.rules', import.meta.url));

let testEnvironment;

const studentProfile = (uid, email) => ({
  uid,
  email,
  displayName: 'GD Student',
  photoURL: null,
  role: 'student',
  approved: false,
  batch: '',
  createdAt: serverTimestamp(),
  lastActiveAt: serverTimestamp(),
});

const progressRecord = (moduleId = 'typography') => ({
  moduleId,
  visitedSections: ['overview'],
  lastSection: 'overview',
  percent: 10,
  completed: false,
  startedAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  completedAt: null,
});

const quizRecord = (moduleId = 'typography') => ({
  moduleId,
  score: 15,
  total: 15,
  percentage: 100,
  answers: {
    introduction: [1,2,2,1,1,1,2,1,1,1,1,1,1,1,1],
    'elements-of-design': [2,1,0,1,1,2,2,1,2,1,0,1,1,1,2],
    principles: [1,0,2,2,2,1,1,2,1,0,1,0,2,1,1],
    typography: [2,1,3,1,3,1,0,1,1,2,1,1,2,1,1],
    'color-theory': [1,2,2,1,0,2,1,0,1,1,1,2,0,1,2],
    grids: [1,0,1,1,0,0,1,1,1,1,1,1,1,1,1],
    'contrast-accessibility': [1,1,2,1,2,1,3,1,1,2,1,0,1,1,1],
  }[moduleId],
  attempts: 1,
  submittedAt: serverTimestamp(),
});

const attendanceRecord = (date = '2026-07-13') => ({
  date,
  status: 'present',
  checkedInAt: serverTimestamp(),
});

const moduleRecord = (id = 'typography') => ({
  id,
  title: 'Typography',
  order: 4,
  open: true,
  availableBatches: ['A', 'B'],
  updatedAt: serverTimestamp(),
  updatedBy: 'admin-user',
});

function studentDb(uid = 'student-one', email = `${uid}@example.edu`) {
  return testEnvironment.authenticatedContext(uid, { email }).firestore();
}

function adminDb() {
  return testEnvironment.authenticatedContext('admin-user', {
    email: 'admin@example.edu',
    admin: true,
  }).firestore();
}

before(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: await readFile(rulesPath, 'utf8') },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment?.cleanup();
});

describe('users', () => {
  test('unauthenticated clients cannot read or create profiles', async () => {
    const db = testEnvironment.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'users/student-one')));
    await assertFails(setDoc(doc(db, 'users/student-one'),
      studentProfile('student-one', 'student-one@example.edu')));
  });

  test('a student can create only their own pending profile', async () => {
    const db = studentDb();
    await assertSucceeds(setDoc(doc(db, 'users/student-one'),
      studentProfile('student-one', 'student-one@example.edu')));
    await assertFails(setDoc(doc(db, 'users/student-two'),
      studentProfile('student-two', 'student-one@example.edu')));
  });

  test('a student cannot self-approve, self-admin, choose a batch, or add fields', async () => {
    const db = studentDb();
    for (const protectedChange of [
      { approved: true },
      { role: 'admin' },
      { batch: 'A' },
      { unexpected: true },
    ]) {
      await assertFails(setDoc(doc(db, 'users/student-one'), {
        ...studentProfile('student-one', 'student-one@example.edu'),
        ...protectedChange,
      }));
    }
  });

  test('an owner may update display fields but not protected fields', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/student-one'), {
        ...studentProfile('student-one', 'student-one@example.edu'),
        createdAt: new Date(),
        lastActiveAt: new Date(),
      });
    });
    const db = studentDb();
    await assertSucceeds(updateDoc(doc(db, 'users/student-one'), {
      displayName: 'Updated Name',
      lastActiveAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(doc(db, 'users/student-one'), { approved: true }));
    await assertFails(updateDoc(doc(db, 'users/student-one'), { role: 'admin' }));
  });

  test('only admins can list users or read another user', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/student-one'), {
        ...studentProfile('student-one', 'student-one@example.edu'),
        createdAt: new Date(),
        lastActiveAt: new Date(),
      });
    });
    await assertFails(getDocs(collection(studentDb('student-two'), 'users')));
    await assertFails(getDoc(doc(studentDb('student-two'), 'users/student-one')));
    const snapshot = await assertSucceeds(getDocs(collection(adminDb(), 'users')));
    assert.equal(snapshot.size, 1);
  });

  test('a profile role field never substitutes for the admin custom claim', async () => {
    const roleOnlyDb = testEnvironment.authenticatedContext('role-only-user', {
      email: 'role-only@example.edu',
      role: 'admin',
    }).firestore();
    await assertFails(getDocs(collection(roleOnlyDb, 'users')));
    await assertFails(setDoc(doc(roleOnlyDb, 'modules/typography'), moduleRecord()));
  });

  test('an admin may approve and assign a student', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/student-one'), {
        ...studentProfile('student-one', 'student-one@example.edu'),
        createdAt: new Date(),
        lastActiveAt: new Date(),
      });
    });
    await assertSucceeds(updateDoc(doc(adminDb(), 'users/student-one'), {
      approved: true,
      batch: 'A',
    }));
  });
});

describe('owner subcollections', () => {
  beforeEach(async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/student-one'), {
        ...studentProfile('student-one', 'student-one@example.edu'),
        approved: true,
        batch: 'A',
        createdAt: new Date(),
        lastActiveAt: new Date(),
      });
      await setDoc(doc(context.firestore(), 'modules/typography'), {
        ...moduleRecord(),
        updatedAt: new Date(),
      });
    });
  });

  test('unauthenticated clients cannot access student subcollections', async () => {
    const db = testEnvironment.unauthenticatedContext().firestore();
    const reference = doc(db, 'users/student-one/progress/typography');
    await assertFails(getDoc(reference));
    await assertFails(setDoc(reference, progressRecord()));
  });

  test('owners can manage valid progress but cannot access another student progress', async () => {
    const owner = studentDb();
    await assertSucceeds(setDoc(
      doc(owner, 'users/student-one/progress/typography'),
      progressRecord(),
    ));
    await assertSucceeds(getDocs(collection(owner, 'users/student-one/progress')));
    await assertFails(getDoc(doc(
      studentDb('student-two'),
      'users/student-one/progress/typography',
    )));
  });

  test('owner progress can advance and complete after a quiz but cannot regress or be deleted', async () => {
    const db = studentDb();
    const reference = doc(db, 'users/student-one/progress/typography');
    await assertSucceeds(setDoc(reference, progressRecord()));
    await assertSucceeds(updateDoc(reference, {
      visitedSections: ['overview', 'objectives'],
      lastSection: 'objectives',
      percent: 20,
      updatedAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(reference, { percent: 10, updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(reference, {
      visitedSections: ['overview'],
      lastSection: 'overview',
      updatedAt: serverTimestamp(),
    }));

    await assertSucceeds(setDoc(
      doc(db, 'users/student-one/quizResults/typography'),
      quizRecord(),
    ));
    await assertSucceeds(updateDoc(reference, {
      visitedSections: ['overview', 'objectives', ...Array.from({ length: 13 }, (_, index) => `step-${index + 1}`)],
      lastSection: 'step-13',
      percent: 100,
      completed: true,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(reference, {
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
    await assertFails(deleteDoc(reference));
  });

  test('progress rejects wrong IDs, invalid element types, and unknown fields', async () => {
    const reference = doc(studentDb(), 'users/student-one/progress/typography');
    await assertFails(setDoc(reference, { ...progressRecord('color-theory') }));
    await assertFails(setDoc(reference, {
      ...progressRecord(),
      visitedSections: ['overview', 42],
    }));
    await assertFails(setDoc(reference, { ...progressRecord(), privateFlag: true }));
  });

  test('a student can create a quiz result once but cannot replace it', async () => {
    const reference = doc(studentDb(), 'users/student-one/quizResults/typography');
    await assertSucceeds(setDoc(reference, quizRecord()));
    await assertFails(setDoc(reference, quizRecord()));
    await assertFails(updateDoc(reference, { score: 3, percentage: 100 }));
  });

  test('a legitimate partial quiz score is accepted when answers, score, and percentage agree', async () => {
    const record = quizRecord();
    const answers = [...record.answers];
    answers[0] = 0;
    await assertSucceeds(setDoc(
      doc(studentDb(), 'users/student-one/quizResults/typography'),
      { ...record, answers, score: 14, percentage: 14 * 100 / 15 },
    ));
  });

  test('quiz answers must be numeric and the record must match its module path', async () => {
    const reference = doc(studentDb(), 'users/student-one/quizResults/typography');
    const invalidAnswers = [...quizRecord().answers];
    invalidAnswers[1] = 1.5;
    await assertFails(setDoc(reference, { ...quizRecord(), answers: invalidAnswers }));
    await assertFails(setDoc(reference, { ...quizRecord('grids') }));
    await assertFails(setDoc(reference, { ...quizRecord(), score: 14, percentage: 93.33333333333333 }));
  });

  test('pending students and closed or unassigned modules cannot create learning records', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await updateDoc(doc(context.firestore(), 'users/student-one'), { approved: false });
    });
    await assertFails(setDoc(
      doc(studentDb(), 'users/student-one/progress/typography'),
      progressRecord(),
    ));

    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await updateDoc(doc(context.firestore(), 'users/student-one'), { approved: true });
      await updateDoc(doc(context.firestore(), 'modules/typography'), { open: false });
    });
    await assertFails(setDoc(
      doc(studentDb(), 'users/student-one/progress/typography'),
      progressRecord(),
    ));

    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await updateDoc(doc(context.firestore(), 'modules/typography'), {
        open: true,
        availableBatches: ['B'],
      });
    });
    await assertFails(setDoc(
      doc(studentDb(), 'users/student-one/progress/typography'),
      progressRecord(),
    ));
  });

  test('a student can check in present once but cannot forge another status', async () => {
    const reference = doc(studentDb(), 'users/student-one/attendance/2026-07-13');
    await assertSucceeds(setDoc(reference, attendanceRecord()));
    await assertFails(setDoc(reference, attendanceRecord()));
    const otherDate = doc(studentDb(), 'users/student-one/attendance/2026-07-14');
    await assertFails(setDoc(otherDate, { ...attendanceRecord('2026-07-14'), status: 'excused' }));
  });

  test('admins can read and manage any student subcollection', async () => {
    const db = adminDb();
    await assertSucceeds(setDoc(
      doc(db, 'users/student-one/quizResults/typography'),
      { ...quizRecord(), submittedAt: new Date() },
    ));
    await assertSucceeds(setDoc(
      doc(db, 'users/student-one/attendance/2026-07-13'),
      { ...attendanceRecord(), status: 'excused', checkedInAt: new Date() },
    ));
    await assertSucceeds(getDocs(query(
      collection(db, 'users/student-one/attendance'),
      where('status', '==', 'excused'),
    )));
  });

  test('collection-group access across users requires the admin claim', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      for (const uid of ['student-one', 'student-two']) {
        await setDoc(doc(context.firestore(), `users/${uid}/progress/typography`), {
          ...progressRecord(),
          startedAt: new Date(),
          updatedAt: new Date(),
        });
        await setDoc(doc(context.firestore(), `users/${uid}/quizResults/typography`), {
          ...quizRecord(),
          submittedAt: new Date(),
        });
        await setDoc(doc(context.firestore(), `users/${uid}/attendance/2026-07-13`), {
          ...attendanceRecord(),
          checkedInAt: new Date(),
        });
      }
    });
    await assertFails(getDocs(collectionGroup(studentDb(), 'progress')));
    await assertFails(getDocs(collectionGroup(studentDb(), 'quizResults')));
    await assertFails(getDocs(collectionGroup(studentDb(), 'attendance')));
    for (const name of ['progress', 'quizResults', 'attendance']) {
      const snapshot = await assertSucceeds(getDocs(collectionGroup(adminDb(), name)));
      assert.equal(snapshot.size, 2);
    }
  });
});

describe('modules', () => {
  test('modules are publicly readable but unauthenticated writes fail', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'modules/typography'), {
        ...moduleRecord(),
        updatedAt: new Date(),
      });
    });
    const publicDb = testEnvironment.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(publicDb, 'modules/typography')));
    await assertSucceeds(getDocs(collection(publicDb, 'modules')));
    await assertFails(setDoc(doc(publicDb, 'modules/grids'), moduleRecord('grids')));
  });

  test('an admin can write valid modules and invalid batch values fail', async () => {
    const db = adminDb();
    await assertSucceeds(setDoc(doc(db, 'modules/typography'), moduleRecord()));
    await assertFails(setDoc(doc(db, 'modules/grids'), {
      ...moduleRecord('grids'),
      availableBatches: ['C'],
    }));
  });
});

test('unknown collections are denied even to admins', async () => {
  await assertFails(setDoc(doc(adminDb(), 'secrets/example'), { value: true }));
});
