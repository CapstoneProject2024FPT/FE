/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
} from "../firebase/pushNotification";

export const useNotifications = () => {
  const [notification, setNotification] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        setTokenFound(true);
      }
    };
    fetchToken();

    const unsubscribe = onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      })
      .catch((err) => console.log("failed: ", err));

    return () => {
      unsubscribe.catch((err) => console.log("failed: ", err));
    };
  }, []);

  return { notification, isTokenFound };
};
