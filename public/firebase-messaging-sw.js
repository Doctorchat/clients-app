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
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body); // Parse the JSON string
console.log(parsedBody, parsedBody.content, parsedBody && parsedBody.content);
  // Check if 'content' exists in the parsed object
  if (parsedBody && parsedBody.content) {
    self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./images/companyIcon.png",
    });
  } else {
    // Handle the case where 'content' is missing or invalid in the parsed JSON
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});
messaging.setBackgroundMessageHandler(function (payload) {
  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body);
console.log(parsedBody, parsedBody.content, parsedBody && parsedBody.content);
  if (parsedBody && parsedBody.content) {
    return self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./images/companyIcon.png",
    });
  } else {
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Get notification data (assuming it's in the data field)
  const notificationData = event.notification.data;
  console.log("Open the specified URL in a new tab", notificationData, event.notification);

  if (notificationData && notificationData.body) {
    try {
      const bodyData = JSON.parse(notificationData.body);
      const chatId = bodyData.chat_id;

      if (chatId) {
        const url = "https://app-dev.doctorchat.md/chat?id=" + chatId;
        // Open the specified URL in a new tab
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
    console.error("body is missing in the notification data:", notificationData);
  }
});
