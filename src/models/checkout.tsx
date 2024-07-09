export interface CheckOutProp {
  totalAmount: number;
  finalAmount: number;
  note: string;
  machineryList: machineDetail[];
  addressId: string;
}

interface machineDetail {
  machineryId: string;
  quantity: number;
  sellingPrice: number;
}
