// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize Firebase with your actual config
firebase.initializeApp({
  apiKey: "AIzaSyC5ljYSH5GIDG5sma47ozx_LGJjWrsQAHs",
  authDomain: "pushnotification-ae5f0.firebaseapp.com",
  projectId: "pushnotification-ae5f0",
  storageBucket: "pushnotification-ae5f0.appspot.com",
  messagingSenderId: "69989961467",
  appId: "1:69989961467:web:302ce8c3cc533255bcaa5e",
  measurementId: "G-Y6NEWS1YXQ",
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
