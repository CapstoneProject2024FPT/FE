//Payment
export type PaymentType = "COD" | "VNPAY";

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
};

export type CardOption = {
  value: string;
  label: string;
};

export enum PaymentTypeProps {
  VNPAY = "VNPAY",
  COD = "COD",
}

export interface paymentProps {
  orderId: string;
  amount: number;
  paymentType: string;
  callbackUrl: string;
}
