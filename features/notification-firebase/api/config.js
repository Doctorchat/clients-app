export const FIREBASE_VAPID_KEY =
  "BLa90qVXOeCto_aep2nFFSTu9wpZP0vdgKUc1OkiALBVVHH909zIrmSaqJ4CNEyS7eu7VIX5RbNfu8lR-wA8EAc";
export const FIREBASE_API_KEY =  "AIzaSyBJ1I8aqW1b7i6eaic6pUMdCk8ePVPfzxU";
export const FIREBASE_AUTH_DOMAIN = "doctorchat-push.firebaseapp.com";
export const FIREBASE_PROJECT_ID =  "doctorchat-push";
export const FIREBASE_STORAGE_BUCKET = "doctorchat-push.appspot.com";
export const FIREBASE_MESSAGING_SENDER_ID = "373860489948";
export const FIREBASE_APP_ID = "1:373860489948:web:138a8c02fb772e3ba87219";
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
};
// NEED measurementId !!!

export const firebaseApp = initializeApp(firebaseConfig);