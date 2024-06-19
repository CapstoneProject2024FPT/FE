//Payment
export type PaymentType = "paypal" | "credit_card" | "cash";

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
  icons: string[];
};

export type CardOption = {
  value: string;
  label: string;
};
