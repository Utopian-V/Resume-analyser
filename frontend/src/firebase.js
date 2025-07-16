import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDn67ro1Rxcr9VMh4TDZ5yvxf0STFvTojg",
  authDomain: "resume-review-ai.firebaseapp.com",
  projectId: "resume-review-ai",
  storageBucket: "resume-review-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 