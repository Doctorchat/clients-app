export const FIREBASE_VAPID_KEY =
  "BMRyncU-29Lla_yhYeUpmdEnJTrPJIleVSubLnvQI3DGwJRZuAtxfdRgcFN-FmX8Fplz3Mmw4wS8imGQZzZCa6k";
export const FIREBASE_API_KEY =  "AIzaSyABKTKnBMeSllOsG6UtLYpEbc7x1P7m3rw";
export const FIREBASE_AUTH_DOMAIN = "test-547b4.firebaseapp.com";
export const FIREBASE_PROJECT_ID = "test-547b4";
export const FIREBASE_STORAGE_BUCKET = "test-547b4.appspot.com";
export const FIREBASE_MESSAGING_SENDER_ID = "68261551413";
export const FIREBASE_APP_ID = "1:68261551413:web:4f2cd8b496b7885cc9807c";
export const FIREBASE_TOKEN_KEY = "firebase:token";
export const FIREBASE_PERMISSION = "notification:firebase";

import { initializeApp } from 'firebase/app';
const firebaseConfig = {
 apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: "G-3KS8F2JWW8"
};
// NEED measurementId !!!

export const firebaseApp = initializeApp(firebaseConfig);