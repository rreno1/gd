# GD 101 Learning Portal — Deployment Guide

This guide explains how to deploy the GD 101 Graphic Design portal to GitHub Pages and Firebase Hosting. Because the portal has a simplified, zero-build structure (with all static assets located directly at the root of the repository), deploying is fast and straightforward.

---

## 1. GitHub Pages (Branch-based Direct Deployment)

Since all HTML, CSS, JS, and lesson data files are located at the root of the repository, you can configure GitHub to host the repository directly.

### Step-by-Step Setup:
1. Push all your latest commits to the `main` branch of your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure deployment"
   git push origin main
   ```
2. Open your web browser and go to your repository on GitHub: `https://github.com/rreno1/gd`.
3. Click the **Settings** tab at the top of the page.
4. In the left-hand sidebar, click **Pages** (under the "Code and automation" section).
5. Under **Build and deployment** → **Source**, select **Deploy from a branch** from the dropdown menu.
6. Under **Branch**:
   - Select **`main`** from the first dropdown.
   - Select **`/ (root)`** from the second dropdown (this tells GitHub to serve files from the root folder).
7. Click **Save**.

GitHub will generate and host the portal automatically. Within a few minutes, your site will be live at `https://rreno1.github.io/gd/`.

---

## 2. Firebase Hosting (CLI-based Deployment)

Firebase Hosting serves the static assets directly from your local project directory using the Firebase Command Line Interface (CLI).

### Prerequisites:
1. Make sure you have the Firebase CLI installed on your machine. (If not, install it globally using: `npm install -g firebase-tools`).
2. Login to your Firebase account on the command line:
   ```bash
   firebase login
   ```

### Step-by-Step Setup & Deploy:
1. Associate your workspace with your Firebase project (already done in `.firebaserc`).
2. Open your command line terminal in the root of this project directory.
3. Deploy the files to Firebase Hosting using:
   ```bash
   firebase deploy --only hosting
   ```

Firebase will read the `firebase.json` configuration file, which serves the root directory (`"."`) while automatically ignoring all development-specific folders (`tests/`, `tools/`, `node_modules/`, configuration files, and git files). Your portal will be live at your Firebase project domain (e.g. `https://gd-learning-portal.web.app/`).
