export interface CheckOutProp {
  description: string;
  machineryList: machineDetail[];
  addressId: string;
  totalAmountOrder?: number;
  finalAmountOrder?: number;
}

interface machineDetail {
  machineryId: string;
  quantity: number;
  sellingPrice: number;
}
