# GD 101 — Graphic Design Foundations

A static, Firebase-backed learning portal for seven Graphic Design modules. One shared lesson engine powers every dataset, while Firebase Authentication, Cloud Firestore, custom admin claims, and strict rules separate student and instructor access.

## Quick start

```powershell
npm ci
npm run build
npm test
npm run serve
```

Open `http://127.0.0.1:4173`. Until Firebase is configured, the site clearly identifies itself as a local preview and uses browser storage only for disposable progress. Open `http://127.0.0.1:4173/admin.html?preview=admin` to inspect the dashboard with sample records.

## Structure

- `data/lessons/` — seven reviewed lesson datasets
- `js/lesson-engine.js` — shared navigation, progress, activity, quiz, and completion behavior
- `tests/` — content and static configuration tests
- `tools/` — static validation and local serve utility

The private `GD_Class_Record_2026.xlsx` is intentionally ignored. Do not commit or distribute it.
