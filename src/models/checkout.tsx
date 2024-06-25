export interface CheckOutProp {
  accountId: string;
  totalAmount: number;
  finalAmount: number;
  note: string;
  machineryList: machineDetail[];
}

interface machineDetail {
  machineryId: string;
  quantity: number;
  sellingPrice: number;
}
