export interface TransactionProps {
  id: string;
  status: string;
  description: string;
  invoiceId: string;
  totalAmount: number;
  createdAt: Date;
  payType: string;
  transactionJson: null;
  orderId: string;
  paymentId: string;
  accountId: string;
}


export enum StatusTypeTransaction {
  PENDING = "PENDING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

export const statusMappingTransaction = [
  {
    id: StatusTypeTransaction.PENDING,
    name: "Đang chờ xử lí",
  },
  {
    id: StatusTypeTransaction.FAILED,
    name: "Thất bại",
  },
  {
    id: StatusTypeTransaction.SUCCESS,
    name: "Thành Công",
  },

];