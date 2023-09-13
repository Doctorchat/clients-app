import { getToken, onMessage  } from "firebase/messaging";

import messaging from "../../pages/firebase";

import {
  FIREBASE_PERMISSION,
  FIREBASE_TOKEN_KEY,
  FIREBASE_VAPID_KEY,
} from "./api/config";
import { apiUpdateFCMToken } from "./api";

const tokenOptionsFirebase = {
  vapidKey: FIREBASE_VAPID_KEY,
};

const requestPermissionNotification = (getTokenFirebase, permission, messaging) => {
  if ("Notification" in window) {

    Notification.requestPermission().then(async (permission) => {
       console.log(permission, "permission")
      permission === "granted" && (await apiUpdateFCMToken(getTokenFirebase))
      localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify(permission));
      localStorage.removeItem(FIREBASE_TOKEN_KEY);
    });
  } 
};
 
export const fetchToken = async (user=null) => {   
  try {
    const getTokenFirebaseStorage = localStorage.getItem(FIREBASE_TOKEN_KEY);
    const permission = localStorage.getItem(FIREBASE_PERMISSION);
    if (!getTokenFirebaseStorage && !user && !permission) {
      const getTokenFirebase = await getToken(messaging, tokenOptionsFirebase);
      localStorage.setItem(FIREBASE_TOKEN_KEY, JSON.stringify(getTokenFirebase));
    }
    console.log(user, "user")
    if (user) {
      if (!getTokenFirebaseStorage) {
        const getTokenFirebase = await getToken(messaging, tokenOptionsFirebase);
        requestPermissionNotification(getTokenFirebase, permission,messaging);
      } else {
        requestPermissionNotification(getTokenFirebaseStorage, permission,messaging);
      }
    }
            
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};
// fetchToken()

export const onMessageListener = () =>
  new Promise((resolve) => {  
    //  const messaging = firebase.messaging();
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});