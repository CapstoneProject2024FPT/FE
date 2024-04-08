import moment from "moment";

export function formatMoney(number: number) {
  return number?.toLocaleString("it-IT", {
    style: "currency",
    currency: "VNĐ",
  });
}

export const fortmatDateFunc = {
  formatDateTime: async (date: Date) => {
    return await moment(date).format("DD/MM/YYYY HH:mm a");
  },
  formatDate: async (date: Date) => {
    return await moment(date).format("DD/MM/YYYY");
  },
  formatTime: async (date: Date) => {
    return await moment(date).format("HH:mm A");
  },
};

export function truncate(text: string | undefined) {
  const textString = text?.toString();

  if (typeof textString === "string" && textString.length > 20) {
    const truncateText = textString.substring(0, 20);
    return truncateText;
  }
  return textString;
}

export function navigateId(
  route: string,
  suffix: string,
  suffixChange: string | undefined
) {
  const id = suffixChange?.toString();
  if (typeof id === "string") {
    return route.replace(suffix, id);
  }
  return route.replace(suffix, "");
}
