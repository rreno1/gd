#!/usr/bin/env node

import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const HELP = `
Safely grant or revoke the Firebase admin custom claim.

Usage:
  node tools/set-admin.mjs (--uid <uid> | --email <email>) [--revoke] [--project <project-id>]
  node tools/set-admin.mjs --help

Options:
  --uid <uid>          Select a Firebase Auth user by UID.
  --email <email>      Select a Firebase Auth user by email address.
  --revoke             Remove the admin claim instead of granting it.
  --project <id>       Override the Firebase/Google Cloud project ID.
  -h, --help           Show this help.

Authentication:
  This command uses Application Default Credentials. For a local service account,
  set GOOGLE_APPLICATION_CREDENTIALS to the JSON key file path. On Google Cloud,
  use an attached service account. No credentials are read from command arguments.

Examples:
  node tools/set-admin.mjs --email teacher@example.edu
  node tools/set-admin.mjs --uid abc123 --revoke
  node tools/set-admin.mjs --uid abc123 --project my-firebase-project

Claim changes take effect after the user refreshes their ID token (usually by
signing out and back in).
`.trim();

function fail(message) {
  console.error(`Error: ${message}\n\n${HELP}`);
  process.exitCode = 1;
}

function takeValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`${option} requires a value.`);
  }
  return value;
}

function parseArguments(argv) {
  const options = { revoke: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '--uid':
        options.uid = takeValue(argv, index, argument);
        index += 1;
        break;
      case '--email':
        options.email = takeValue(argv, index, argument);
        index += 1;
        break;
      case '--project':
        options.projectId = takeValue(argv, index, argument);
        index += 1;
        break;
      case '--revoke':
        options.revoke = true;
        break;
      default:
        throw new Error(`Unknown option: ${argument}`);
    }
  }

  return options;
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    fail(error.message);
    return;
  }

  if (options.help) {
    console.log(HELP);
    return;
  }

  if (Boolean(options.uid) === Boolean(options.email)) {
    fail('Provide exactly one of --uid or --email.');
    return;
  }

  const appOptions = { credential: applicationDefault() };
  if (options.projectId) {
    appOptions.projectId = options.projectId;
  }

  const app = getApps()[0] ?? initializeApp(appOptions);
  const auth = getAuth(app);
  const user = options.uid
    ? await auth.getUser(options.uid)
    : await auth.getUserByEmail(options.email);

  const existingClaims = user.customClaims ?? {};
  let nextClaims;

  if (options.revoke) {
    const { admin: _removedAdminClaim, ...remainingClaims } = existingClaims;
    nextClaims = remainingClaims;
  } else {
    nextClaims = { ...existingClaims, admin: true };
  }

  await auth.setCustomUserClaims(user.uid, nextClaims);
  const action = options.revoke ? 'Revoked admin access from' : 'Granted admin access to';
  console.log(`${action} ${user.email ?? '(no email)'} (${user.uid}).`);
  console.log('The user must refresh their ID token (usually sign out and back in).');
}

main().catch((error) => {
  console.error(`Failed to update the admin claim: ${error.message}`);
  process.exitCode = 1;
});
