import { getMessaging, getToken } from "firebase/messaging";

import {
  FIREBASE_PERMISSION,
  FIREBASE_TOKEN_KEY,
  FIREBASE_VAPID_KEY,
} from "./api/config";
import { apiUpdateFCMToken } from "./api";
import firebaseApp from './firebase'; 

const tokenOptionsFirebase = {
  vapidKey: FIREBASE_VAPID_KEY,
};

const requestPermissionNotification = (getTokenFirebase, permission) => {
  if ("Notification" in window && !permission) {
    Notification.requestPermission().then(async (permission) => {
      permission === "granted" && (await apiUpdateFCMToken(getTokenFirebase));
      localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify(permission));
      localStorage.removeItem(FIREBASE_TOKEN_KEY);
    });
  }
};

export const fetchToken = async (user) => {
  const messaging = getMessaging(firebaseApp);
  try {
    const getTokenFirebaseStorage = localStorage.getItem(FIREBASE_TOKEN_KEY);
    const permission = localStorage.getItem(FIREBASE_PERMISSION);
    if (!getTokenFirebaseStorage && !user && !permission) {
      const getTokenFirebase = await getToken(messaging, tokenOptionsFirebase);
      localStorage.setItem(FIREBASE_TOKEN_KEY, JSON.stringify(getTokenFirebase));
    }
    if (user) {
      if (!getTokenFirebaseStorage) {
        const getTokenFirebase = await getToken(messaging, tokenOptionsFirebase);
        requestPermissionNotification(getTokenFirebase, permission);
      } else {
        requestPermissionNotification(getTokenFirebaseStorage, permission);
      }
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};
