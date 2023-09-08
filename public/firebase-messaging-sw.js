// firebase-messaging-sw.js


importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');


firebase.initializeApp({
  apiKey:  "AIzaSyBJ1I8aqW1b7i6eaic6pUMdCk8ePVPfzxU",
  authDomain: "doctorchat-push.firebaseapp.com",
  projectId: "doctorchat-push",
  storageBucket: "doctorchat-push.appspot.com",
  messagingSenderId: "373860489948",
  appId: "1:373860489948:web:138a8c02fb772e3ba87219",
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function({data:{title,body,icon,url}}){
    return self.registration.showNotification(title,{body,icon,url});
});