import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
// You need to replace these values with your actual Firebase project configuration
// Go to https://console.firebase.google.com/ -> Your Project -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDn67ro1Rxcr9VMh4TDZ5yvxf0STFvTojg",
  authDomain: "project-507e4.firebaseapp.com",
  projectId: "project-507e4",
  storageBucket: "project-507e4.appspot.com",
  messagingSenderId: "11738231891", // Replace with your actual messagingSenderId
  appId: "1:123456789:web:abcdefghijklmnop" // Replace with your actual appId
};

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field] === '123456789' || firebaseConfig[field] === 'abcdefghijklmnop');
  
  if (missingFields.length > 0) {
    console.error('Firebase configuration is incomplete. Please update the following fields:', missingFields);
    console.error('Get your Firebase config from: https://console.firebase.google.com/ -> Project Settings -> General -> Your apps');
    return false;
  }
  return true;
};

// Initialize Firebase
let app;
let auth;
let googleProvider;

try {
  if (validateFirebaseConfig()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Add custom parameters to Google provider
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('Firebase initialized successfully');
  } else {
    console.error('Firebase initialization failed due to incomplete configuration');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, googleProvider };
export default app; 