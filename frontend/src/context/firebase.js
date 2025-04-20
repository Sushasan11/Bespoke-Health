// firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC5ljYSH5GIDG5sma47ozx_LGJjWrsQAHs",
  authDomain: "pushnotification-ae5f0.firebaseapp.com",
  projectId: "pushnotification-ae5f0",
  storageBucket: "pushnotification-ae5f0.appspot.com",
  messagingSenderId: "69989961467",
  appId: "1:69989961467:web:302ce8c3cc533255bcaa5e",
  measurementId: "G-Y6NEWS1YXQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Generate FCM Token
export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const token = await getToken(messaging, {
        vapidKey:
          "BJvtvb2s_g8WLdKrbcSkwZqxofA2Qw0ifDZm-jnLr4Oo5rExIoSpxiUsMwS3RZd8w4IE2FJdsnsGfBXeOhhRIBc",
        serviceWorkerRegistration: registration,
      });
    }
  } catch (err) {
    console.error(
      "Token generation or service worker registration failed:",
      err
    );
  }
};

// export messaging
export { messaging };
