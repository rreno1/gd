# 🚀 Firebase Setup Guide for GD Learning Portal

Follow these steps to create your Firebase project and hook it up to your website. This should take about 5 minutes.

---

## Step 1: Create a Firebase Project

1. Open your browser and go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Sign in using your Google Account (`rrjrenomeron@mlgcl.edu.ph`)
3. Click **"Create a project"** (or **"Add project"**)
4. Enter the project name: **`gd-learning-portal`** (or another name you prefer)
5. **Disable** Google Analytics for this project (it is not needed) and click **Create project**
6. Wait for the setup to complete and click **Continue**

---

## Step 2: Register a Web App

1. On the project overview page, click the **Web icon** (`</>`) to add an app
2. Enter the app nickname: **`GD Learning Portal`**
3. Click **Register app**
4. Copy the values from the `firebaseConfig` object shown on the screen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "gd-learning-portal.firebaseapp.com",
  projectId: "gd-learning-portal",
  storageBucket: "gd-learning-portal.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};
```
5. Paste these copied credentials directly into your project's configuration file at:
   📄 [js/firebase-config.js](file:///c:/Users/ordnr/Desktop/GD/js/firebase-config.js)
6. Click **Continue to console**

---

## Step 3: Enable Google Sign-In Provider

1. In the left sidebar, click **Build** → **Authentication**
2. Click the **Sign-in method** tab, then click **Get started**
3. Under **Additional providers**, click **Google**
4. Click **Enable** (top right toggle)
5. Set the **Project support email** to your email (`rrjrenomeron@mlgcl.edu.ph`)
6. Click **Save**

---

## Step 4: Add Authorized Domain for Google Sign-In

To allow sign-ins from your GitHub Pages live site:
1. On the **Authentication** page, click the **Settings** tab (next to Sign-in method)
2. In the left sub-menu, click **Authorized domains**
3. Click **Add domain**
4. Enter your GitHub Pages domain: **`rreno1.github.io`**
5. Click **Add**

---

## Step 5: Initialize Cloud Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select your Database location (e.g., `asia-east1` or default close to you) and click **Next**
4. Choose **Start in test mode** and click **Create**
5. Wait for the database provisioning to complete

---

## Step 6: Publish Security Rules

1. On the **Firestore Database** page, click the **Rules** tab at the top
2. Replace the entire code editor content with the rules below:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function: is the current user an admin?
    function isAdmin() {
      return request.auth != null && 
        (request.auth.token.email == 'rrjrenomeron@mlgcl.edu.ph' || 
         request.auth.token.email == 'rrenomeronjr@gmail.com');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      
      // Progress subcollection
      match /progress/{moduleId} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
      
      // Quiz results subcollection
      match /quizResults/{moduleId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Attendance subcollection
      match /attendance/{date} {
        allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
        allow write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }
    
    // Modules configuration (for open/close)
    match /modules/{moduleId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```
```

---

## Step 7: Push the Config to GitHub

Once you save [js/firebase-config.js](file:///c:/Users/ordnr/Desktop/GD/js/firebase-config.js) with your real credentials, commit it and push it to your repository:

```bash
git add js/firebase-config.js
git commit -m "Configure Firebase keys"
git push origin main
```

Your GD 101 interactive portal is now ready! 🚀
