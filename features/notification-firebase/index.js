import { useState } from "react";
import firebase from 'firebase/app';
import { getMessaging, getToken, onMessage  } from "firebase/messaging";

import 'firebase/messaging';

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

          // Funcția pentru tratarea notificărilor primite
    const handleNotification = ({ data: { body, title } }) => {
      // Afiseaza notificarea sau implementeaza logica de gestionare a notificarilor
      new Notification(title, { body });
    };

    // Atașează funcția de tratare a notificărilor la evenimentul onMessage
    
    console.log(messaging)
    messaging?.onMessage(handleNotification);
  }
  
};

export const fetchToken = async (user,firebaseApp) => {
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
        requestPermissionNotification(getTokenFirebase, permission,messaging);
      } else {
        requestPermissionNotification(getTokenFirebaseStorage, permission,messaging);
      }
    }
            
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};