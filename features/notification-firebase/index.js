import { getMessaging, getToken } from "firebase/messaging";

import { firebaseApp } from "@/features/notification-firebase/api/config";

import { FIREBASE_PERMISSION, FIREBASE_TOKEN_KEY, FIREBASE_VAPID_KEY } from "./api/config";
import { apiUpdateFCMToken } from "./api";

export const fetchToken = async (user = null) => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const getTokenFirebaseStorage = localStorage.getItem(FIREBASE_TOKEN_KEY);
      const permissionStorage = localStorage.getItem(FIREBASE_PERMISSION);
      if (permissionStorage || (!user && getTokenFirebaseStorage)) {
        return;
      }
      if (user) {
        if (!getTokenFirebaseStorage) {
          setTokenStorage().then(async (notifPermission) => {
            if (notifPermission) {
              await apiUpdateFCMToken(getTokenFirebaseStorage);
              localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify("true"));
              localStorage.removeItem(FIREBASE_TOKEN_KEY);
            } else {
              console.log("Notifications are not active");
            }
          });
        } else if (getTokenFirebaseStorage) {
          await apiUpdateFCMToken(getTokenFirebaseStorage);
          localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify("true"));
          localStorage.removeItem(FIREBASE_TOKEN_KEY);
        }
      } else if (!user) {
        if (!getTokenFirebaseStorage) {
          setTokenStorage();
          return;
        }
      }
    } catch (err) {
      console.log("An error occurred while retrieving token. ", err);
    }
  }
};
const setTokenStorage = async () => {
  const messaging = getMessaging(firebaseApp);
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const currentToken = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
    });
    if (currentToken) {
      localStorage.setItem(FIREBASE_TOKEN_KEY, JSON.stringify(currentToken));
      return true;
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } else {
    return false;
  }
};
