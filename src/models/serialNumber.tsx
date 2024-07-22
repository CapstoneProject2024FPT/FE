export interface serialProps {
  id: string;
  serialNumber: string;
  status: string;
  type: string;
  createDate: Date | string;
  machineryId: string;
  condition: string;
  isRepaired: string;
  soldDate: string;
  machineComponentsId: string;
  masterInventoryId: string;
}

export enum statusSerial {
  Available = "Available",
  Sold = "Sold",
  Discontinued = "Discontinued",
}

export enum typeSerial {
  MACHINERY = "Machinery",
  MATERIAL = "Material",
}

export enum conditionSerial {
  NEW = "New",
  OLD = "Old",
  CURRENT = "CurrentlyinUse",
}

export enum repairSerial {
  ISREPAIR = "IsRepaired",
  NEW_INV = "New",
}
