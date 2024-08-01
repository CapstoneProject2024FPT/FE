import React from "react";
import { useNotifications } from "../hooks/useNotification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationComponent: React.FC = () => {
  const { notification, isTokenFound } = useNotifications();

  React.useEffect(() => {
    if (notification) {
      toast.info(`${notification.title}: ${notification.body}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [notification]);

  return (
    <div>
      <ToastContainer />
      {isTokenFound && <h1>Notification permission enabled 👍🏻</h1>}
      {!isTokenFound && <h1>Need notification permission ❗️ </h1>}
    </div>
  );
};

export default NotificationComponent;
