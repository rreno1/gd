# GD 101 — Graphic Design Foundations

A static, Firebase-backed learning portal for seven Graphic Design modules. One shared lesson engine powers every dataset, while Firebase Authentication, Cloud Firestore, custom admin claims, and strict Security Rules separate student and instructor access.

## Quick start

```powershell
npm ci
npm run build
npm test
npm run serve
```

Open `http://127.0.0.1:4173`. Until Firebase is configured, the site clearly identifies itself as a local preview and uses browser storage only for disposable demo progress. Open `http://127.0.0.1:4173/admin.html?preview=admin` to inspect the dashboard with sample records.

For Firebase, GitHub Pages, administrator setup, testing, deployment, and rollback, follow [DEPLOYMENT.md](DEPLOYMENT.md).

## Structure

- `public/` — the deployable site used by Firebase Hosting and GitHub Pages
- `public/data/lessons/` — seven reviewed lesson datasets
- `public/js/lesson-engine.js` — shared navigation, progress, activity, quiz, and completion behavior
- `gd-presentations/` — preserved legacy source decks
- `firestore.rules` — owner/admin authorization and strict field validation
- `tests/` — content, static, and Firestore Rules tests
- `tools/` — legacy sync, validation, local server, and admin-claim utility

The private `GD_Class_Record_2026.xlsx` is intentionally ignored. Do not move it into `public/`, commit it, or attach it to a deployment.
