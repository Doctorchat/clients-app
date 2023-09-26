// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

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
  console.log("[firebase-messaging-sw.js] Received background message ", title, body);
  const { title, body } = payload.data;
  const { content } = JSON.parse(body);

  self.registration.showNotification(title, {
    body: content,
    icon: "./images/companyIcon.png",
  });
});
messaging.setBackgroundMessageHandler(function (payload) {
  const { title, body } = payload.data;
  const { content } = JSON.parse(body);

  return self.registration.showNotification(title, {
    body: content,
    icon: "./images/companyIcon.png",
  });
});

// Service worker event listener
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  // Get notification data (assuming it's in the data field)
  const notificationData = event.notification.data;
  console.log(" Open the specified URL in a new tab");
  if (notificationData && notificationData.clickAction) {
    console.log(" Open the specified URL in a new tab");
    // Open the specified URL in a new tab
    // event.waitUntil(clients.openWindow(notificationData.clickAction));
  }
});
