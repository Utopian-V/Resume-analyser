# Firebase Setup Guide

## Current Status
Your Firebase configuration is partially complete. You need to update the `appId` field.

## Steps to Complete Setup

### 1. Get Your App ID
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `project-507e4`
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Find your web app or create one if it doesn't exist
6. Copy the `appId` from the configuration

### 2. Update Firebase Config
Replace the `appId` in `frontend/src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDn67ro1Rxcr9VMh4TDZ5yvxf0STFvTojg",
  authDomain: "project-507e4.firebaseapp.com",
  projectId: "project-507e4",
  storageBucket: "project-507e4.appspot.com",
  messagingSenderId: "11738231891",
  appId: "YOUR_ACTUAL_APP_ID_HERE" // Replace this
};
```

### 3. Enable Google Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Google** provider
5. Add your authorized domains (localhost for development, your domain for production)

### 4. Test the Setup
1. Open browser console (F12)
2. Look for "Firebase initialized successfully" message
3. Try signing in with Google
4. Check for any error messages in console

## Common Issues

### Pop-up Blocked
- Allow pop-ups for your domain
- Try using a different browser

### Unauthorized Domain
- Add your domain to authorized domains in Firebase Console
- For development: `localhost`, `127.0.0.1`
- For production: your actual domain

### Network Issues
- Check internet connection
- Try refreshing the page

## Debug Information
The app will log Firebase status to console. Check for:
- "Firebase initialized successfully"
- "Auth state changed: [email]"
- Any error messages 