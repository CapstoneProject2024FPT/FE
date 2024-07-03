//Payment
export type PaymentType = "COD" | "Vnpay";

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
};

export type CardOption = {
  value: string;
  label: string;
};
