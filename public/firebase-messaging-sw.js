/* eslint-disable */
// The rest of your service worker code...
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAlkbqhhEHHVGvracWexnlXKu-qIHD2a28",
  authDomain: "selling-maintainance-machinery.firebaseapp.com",
  projectId: "selling-maintainance-machinery",
  storageBucket: "selling-maintainance-machinery.appspot.com",
  messagingSenderId: "281208452095",
  appId: "1:281208452095:web:1daace5dc7b6bd0cdaedca",
  measurementId: "G-MHFR6SB0Z4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
