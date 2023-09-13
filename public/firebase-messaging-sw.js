// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyABKTKnBMeSllOsG6UtLYpEbc7x1P7m3rw",
  authDomain: "test-547b4.firebaseapp.com",
  projectId: "test-547b4",
  storageBucket: "test-547b4.appspot.com",
  messagingSenderId: "68261551413",
  appId: "1:68261551413:web:4f2cd8b496b7885cc9807c",
  measurementId: "G-3KS8F2JWW8"
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration?.showNotification(notificationTitle,
//     notificationOptions);
// });

messaging.onBackgroundMessage(messaging, function ({ data }) {
  console.log('Received background message ', data);
  if (data && data.title) {
    console.log('Received background message ', data);
    const notificationTitle = data.title;
    const notificationOptions = {
      body: data.body,
    };

    self.registration?.showNotification(notificationTitle, notificationOptions);
  }
})

