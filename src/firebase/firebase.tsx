import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey_FIREBASE,
  authDomain: import.meta.env.VITE_authDOMAIN_FIREBASE,
  projectId: import.meta.env.VITE_projectId_FIREBASE,
  storageBucket: import.meta.env.VITE_storageBucket_FIREBASE,
  messagingSenderId: import.meta.env.VITE_messagingSenderId_FIREBASE,
  appId: import.meta.env.VITE_appId_FIREBASE,
  measurementId: import.meta.env.VITE_measurementId_FIREBASE,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;
