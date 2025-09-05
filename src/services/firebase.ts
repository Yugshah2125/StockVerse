import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCmvj7fXTJSCHbRCRZyodK5UypTXLzTJ_E",
  authDomain: "stockverse-d7432.firebaseapp.com",
  projectId: "stockverse-d7432",
  storageBucket: "stockverse-d7432.firebasestorage.app",
  messagingSenderId: "253966024145",
  appId: "1:253966024145:web:ab2a29df346126d3cc74f0"
};

console.log('Firebase Config loaded successfully');

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);