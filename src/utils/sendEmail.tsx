import emailjs from "@emailjs/browser";

const SERVICE_ID_EMAILJS = import.meta.env.VITE_serviceId_EMAILJS;
const TEMPLATE_ID_EMAILJS = import.meta.env.VITE_templateId_EMAILJS;
const USER_ID_EMAILJS = import.meta.env.VITE_userId_EMAILJS;

export function handleSendEmail (isSuccess:boolean, email: string, username: string) {

    const message = isSuccess
    ? `Chào, ${username} bạn đã thanh toán đơn hàng thành công!`
    : `Chào, ${username} bạn đã hủy đơn hàng thành công!`;

  const templateParams = {
    from_name: "Admin SMMMS", // You can customize this field
    from_email: "ad.smmms.gsu24se44@gmail.com",
    to_email: email,
    message,
    reply_to: "NoReply",
    user_name: username,
  };

  emailjs.send(
    SERVICE_ID_EMAILJS, // Replace with your EmailJS service ID
    TEMPLATE_ID_EMAILJS, // Replace with your EmailJS template ID
    templateParams,
    USER_ID_EMAILJS // Replace with your EmailJS user ID
  );
}
