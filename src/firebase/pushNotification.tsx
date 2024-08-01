import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token:", token);
      // Send this token to your C# backend
      // await sendTokenToBackend(token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
};

// Function to send FCM token to your C# backend
const sendTokenToBackend = async (token: string) => {
  try {
    const response = await fetch("YOUR_BACKEND_API_URL/register-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error("Failed to send token to backend");
    }
    console.log("Token successfully sent to backend");
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

// Function to handle incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
