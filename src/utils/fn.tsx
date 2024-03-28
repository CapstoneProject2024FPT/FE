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
