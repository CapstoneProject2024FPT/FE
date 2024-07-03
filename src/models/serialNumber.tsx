export interface serialProps {
  id: string;
  serialNumber: string;
  status: string;
  type: string;
  createDate: Date | string;
  machineryId: string;
}

export enum statusSerial {
  Available = "Available",
  Sold = "Sold",
  Discontinued = "Discontinued",
}
