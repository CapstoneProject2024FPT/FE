export interface CheckOutProp {
  description: string;
  machineryList: machineDetail[];
  addressId: string;
}

interface machineDetail {
  machineryId: string;
  quantity: number;
  sellingPrice: number;
}
