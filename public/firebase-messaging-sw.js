// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyBJ1I8aqW1b7i6eaic6pUMdCk8ePVPfzxU",
  authDomain: "doctorchat-push.firebaseapp.com",
  projectId: "doctorchat-push",
  storageBucket: "doctorchat-push.appspot.com",
  messagingSenderId: "373860489948",
  appId: "1:373860489948:web:138a8c02fb772e3ba87219",
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration?.showNotification(notificationTitle, notificationOptions);
// });

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.onBackgroundMessage(messaging, function ({ data }) {
//   console.log("Received background message ", data);
//   if (data && data.title) {
//     console.log("Received background message ", data);
//     const notificationTitle = data.title;
//     const notificationOptions = {
//       body: data.body,
//     };

//     self.registration?.showNotification(notificationTitle, notificationOptions);
//   }
// });

// messaging.setBackgroundMessageHandler(function ({ data: { title, body, icon, url } }) {
//   return self.registration.showNotification(title, { body, icon, url });
// });
