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

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body); // Parse the JSON string
  if (parsedBody && parsedBody.content) {
    self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./images/companyIcon.png",
      data: parseInt(parsedBody.chat_id),
    });
  } else {
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});
messaging.setBackgroundMessageHandler(function (payload) {
  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body);
  if (parsedBody && parsedBody.content) {
    return self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./images/companyIcon.png",
      data: parseInt(parsedBody.chat_id),
    });
  } else {
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const notificationData = event.notification.data;
  const notificatioBody = event.notification.body;

  if (notificatioBody) {
    try {
      if (notificationData) {
        const url = "https://app-dev.doctorchat.md/chat?id=" + notificationData;
        event.waitUntil(
          // eslint-disable-next-line no-undef
          clients.openWindow(url).then(() => {
            // Do something after the new tab is opened, if needed
            console.log("New tab opened with URL:", url);
          })
        );
      } else {
        console.error("chat_id is missing in the notification data:", notificationData);
      }
    } catch (error) {
      console.error("Error parsing JSON from body:", error);
    }
  } else {
    console.error("body is missing in the notification data:", event.notification);
  }
});
