# GD 101 deployment guide

The repository produces one static `public/` directory for both GitHub Pages and Firebase Hosting. Firebase supplies sign-in, secure student records, module controls, attendance, and the administrator dashboard. GitHub Pages is a second host for the same client; it still talks to the same Firebase project.

## 1. Local prerequisites and checks

Install:

- Node.js 20 or later.
- Java JDK 11 or later for the Firestore emulator.
- Git.

From the repository root:

```powershell
npm ci
npm run build
npm test
npm run test:rules
npm run serve
```

`npm run build` validates the site and copies the preserved decks from `gd-presentations/` into the generated `public/legacy/` directory. Open `http://127.0.0.1:4173`. The unconfigured portal runs only as a clearly labeled preview; its browser data is disposable and is not a substitute for Firebase.

The Firestore Rules test starts an isolated emulator, proves owner/admin boundaries, and shuts it down. Firebase documents Java 11+ as a Local Emulator Suite requirement: [install and configure the Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure).

## 2. Create and connect the GitHub repository

The local repository and preservation commit already exist. Create an empty repository in GitHub without adding a README, `.gitignore`, or license, then connect and push it:

```powershell
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions** and run **Deploy GD portal to GitHub Pages**, or push to `main`.
4. In the `github-pages` environment, optionally require approval for production deployments.

The committed workflow follows GitHub's supported `configure-pages`, `upload-pages-artifact`, and `deploy-pages` sequence: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 3. Create the Firebase project and web app

1. In the [Firebase console](https://console.firebase.google.com/), create a project.
2. In **Project settings → General → Your apps**, select the web icon and register a web app.
3. Copy the web configuration object into `public/js/firebase-config.js`. Keep the `window.GD_FIREBASE_CONFIG = { ... }` wrapper.
4. In **Build → Authentication → Sign-in method**, enable **Google** and select the project support email.
5. In **Authentication → Settings → Authorized domains**, add the hostname for every deployment:
   - `YOUR_PROJECT_ID.web.app`
   - `YOUR_PROJECT_ID.firebaseapp.com`
   - `YOUR_ACCOUNT.github.io`
   - any custom domain, without `https://` or a path
   - `localhost` for local development
6. In **Build → Firestore Database**, create the database in Production mode and select the region closest to the class.

Firebase's current Google sign-in guide requires enabling the provider and adding custom deployment domains to Authorized domains: [Authenticate using Google with JavaScript](https://firebase.google.com/docs/auth/web/google-signin).

The web configuration identifies the project; it is not an administrator credential. Security comes from Authentication, ID tokens, custom claims, and the deployed Firestore Rules. Never put a service-account JSON key in `public/` or Git.

## 4. Connect the Firebase CLI

The project includes the Firebase CLI as a locked development dependency. Authenticate and select the project:

```powershell
npx firebase login
npx firebase projects:list
Copy-Item .firebaserc.example .firebaserc
npx firebase use --add
```

Choose the new Firebase project and assign the `default` alias. Confirm that `.firebaserc` contains the correct project ID. The provided `firebase.json` already points Hosting to `public/` and Firestore to the strict rules and indexes; do not rerun `firebase init hosting`, because initialization can overwrite the reviewed Hosting configuration.

## 5. Deploy and verify Firestore security

Run the emulator test before every rules deployment:

```powershell
npm run test:rules
npx firebase deploy --only firestore
```

The rules enforce:

- public reads and admin-only writes for `modules/{moduleId}`;
- owner-only reads for a student's profile, progress, quiz results, and attendance;
- create-once student quiz and daily attendance records;
- quiz totals recomputed from the 15 stored answers and the reviewed module key;
- monotonic progress updates that cannot discard visited sections or completed state;
- protected approval, role, and batch fields;
- cross-user queries and updates only when `request.auth.token.admin == true`;
- an explicit deny for every other path.

Client-side visibility checks are convenience only. Firebase Security Rules make the authorization decision. See [Firebase Security Rules](https://firebase.google.com/docs/rules) and [Cloud Firestore field restrictions](https://firebase.google.com/docs/firestore/security/rules-fields).

## 6. Assign the first administrator safely

First sign in to the deployed portal once so Firebase Authentication creates the user. Then use the provided utility from a privileged local environment.

One supported approach is a Firebase service-account key:

1. Open **Firebase console → Project settings → Service accounts**.
2. Generate a private key and save the JSON outside this repository.
3. Point Application Default Credentials to that file for the current terminal.
4. Grant the claim by exact email or UID.

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\secure\path\firebase-admin-key.json'
node tools/set-admin.mjs --email teacher@example.edu --project YOUR_PROJECT_ID
```

Sign out and back in to refresh the Firebase ID token. The dashboard accepts only the `admin: true` token claim. A `role: "admin"` value in a Firestore profile does not grant authority.

To revoke access:

```powershell
node tools/set-admin.mjs --email teacher@example.edu --project YOUR_PROJECT_ID --revoke
```

Keep the key in secure storage, restrict its permissions, rotate or delete it when it is no longer required, and clear the terminal variable. Firebase requires custom claims to be set from a privileged Admin SDK environment: [Control access with custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

## 7. Configure modules and approve students

1. Sign in with the administrator account and open `admin.html`.
2. In **Course modules**, confirm the seven modules and set each one open or closed. The first authorized dashboard visit creates any missing module records with Module 1 open and Modules 2–7 closed; adjust those defaults before inviting students.
3. In **Approvals**, verify each student identity, assign Batch A or B, and approve the account.
4. Use **Gradebook**, **Attendance**, and **Accounts** to verify that cross-user data is visible only to the administrator.

New students create a pending profile on first Google sign-in. They cannot approve themselves, change their batch or role, overwrite a quiz, or read another student's record.

## 8. Deploy Firebase Hosting

Build and deploy the same `public/` artifact:

```powershell
npm run check
npm run build
npx firebase deploy --only hosting
```

The result is available at `https://YOUR_PROJECT_ID.web.app` and `https://YOUR_PROJECT_ID.firebaseapp.com`. Firebase's static Hosting quickstart uses `public/` and `firebase deploy --only hosting`: [Get started with Firebase Hosting](https://firebase.google.com/docs/hosting/quickstart).

For a custom domain, add it in **Firebase console → Hosting → Add custom domain**, complete DNS verification, then add the hostname to Authentication's Authorized domains.

## 9. Routine updates

For each content or interface update:

```powershell
git checkout -b update/short-description
npm ci
npm run check
npm run build
git add public gd-presentations tests tools firestore.rules firestore.indexes.json firebase.json package.json package-lock.json DEPLOYMENT.md README.md .github
git commit -m "feat: describe the update"
git push -u origin update/short-description
```

Review and merge the pull request. GitHub Pages deploys the merge automatically. After the same commit is approved for Firebase:

```powershell
git checkout main
git pull --ff-only
npm ci
npm run check
npm run build
npx firebase deploy --only hosting
```

If rules or indexes changed, use `npx firebase deploy --only firestore` only after `npm run test:rules` passes.

## 10. Rollback

For GitHub Pages, revert the faulty commit and push the revert to `main`:

```powershell
git revert BAD_COMMIT_SHA
git push origin main
```

The Pages workflow publishes the restored artifact. Avoid history-rewriting resets on a shared branch.

For Firebase Hosting, open **Firebase console → Hosting & Serverless → Hosting**, find the previous entry in **Release History**, open its actions menu, and select **Roll back**. Firebase retains earlier Hosting versions specifically for this workflow: [Manage Hosting releases and versions](https://firebase.google.com/docs/hosting/manage-hosting-resources).

Firestore data and Security Rules are independent of Hosting rollback. If a rules deployment must be reversed, restore the reviewed rules from Git and deploy them explicitly:

```powershell
git restore --source GOOD_COMMIT_SHA -- firestore.rules firestore.indexes.json
npm run test:rules
npx firebase deploy --only firestore
```

Commit that restoration so the repository again matches production.

## Final production checklist

- The private class workbook and service-account keys are absent from Git history and `public/`.
- `npm run check`, `npm run build`, and `npm run test:rules` pass.
- Google Authentication includes Firebase Hosting, GitHub Pages, localhost, and custom domains as authorized hosts.
- The first administrator gets authority only from the `admin` custom claim.
- A new student remains pending until approved and cannot open closed/unassigned modules.
- Student A cannot read or update Student B's records.
- Quiz submission is create-once for students and visible in the administrator gradebook.
- Desktop and mobile Home, Lesson, Progress, and Admin flows are checked in both themes.
- Both hosts serve the same generated `public/` content and every legacy activity link opens.
