import { AddressDetail } from "./order";
import { ProductAdmin } from "./products";

export enum StatusType {
  PENDING = "Pending",
  COMPLETED = "Completed",
  CANCELED = "Cancel",
  PROCESS = "Process",
  AWAITINGASSIGNMENT = "AwaitingAssignment",
}

export const warrantyStatusMapping = [
  {
    id: StatusType.PENDING,
    name: "Chờ xác nhận",
  },
  {
    id: StatusType.COMPLETED,
    name: "Hoàn thành",
  },
  {
    id: StatusType.CANCELED,
    name: "Đã hủy",
  },
  {
    id: StatusType.PROCESS,
    name: "Đang thực thi",
  },
  {
    id: StatusType.AWAITINGASSIGNMENT,
    name: "Đang cử nhân viên",
  },
];

export interface WarrantyProps {
  id: string;
  completionDate: Date;
  createDate: Date;
  description: string;
  startDate: Date;
  status: string;
  type: string;
  customer: {
    id: string;
    fullName: string;
    role: string;
  };
  inventory: Inventory;
  address: AddressDetail;
}

interface Inventory {
  machinery: ProductAdmin;
  id: string;
  serialNumber: string;
  type: string;
}

export interface WarrantyPropsById extends WarrantyProps {
  warrantyDetail: WarrantyDetailProps[];
}

export interface WarrantyDetailProps {
  id: string;
  status: string;
  createDate: Date;
  startDate: Date;
  description: string;
  comments: string;
  accountId: string;
  warrantyId: string;
  staff: {
    fullName: string;
    role: string;
    id: string;
  };
}

export interface WarrantyPropsRequest {
  type: string;
  startDate: Date;
  description: string;
  priority: number;
  inventoryId: string;
  executionTime: number;
}

export interface WarrantyGetProps {
  id: string;
  type: string;
  createDate: Date;
  startDate: Date;
  completionDate: Date;
  status: string;
  description: string;
  comments: string;
  nextMaintenanceDate: Date;
  userInfor: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface CreateWarranty {
  description: string;
  inventoryId: string;
  addressId: string;
  accountId: string;
}

interface WarrantyDetail {
  id: string;
  status: string;
  createDate: Date;
  startDate: Date;
  description: string;
  comments: string | null;
  warrantyId: string;
  accountId: string | null;
  staff: {
    fullName: string;
    role: string;
    id: string;
  };
}

interface Inventory {
  id: string;
  serialNumber: string;
  type: string;
  machinery: ProductAdmin;
}

interface Customer {
  id: string;
  fullName: string;
  role: string;
}

interface Address {
  id: string;
  name: string;
  status: string;
  note: string;
  namePersonal: string;
  phoneNumber: string;
  city: {
    id: string;
    unitId: number;
    name: string;
  };
  district: {
    id: string;
    unitId: number;
    name: string;
  };
  ward: {
    id: string;
    unitId: number;
    name: string;
  };
  account: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface WarrantyDetails {
  id: string;
  type: string;
  createDate: string;
  startDate: string;
  completionDate: string | null;
  status: string;
  description: string | null;
  comments: string | null;
  nextMaintenanceDate: string | null;
  priority: number;
  warrantyDetail: WarrantyDetail[];
  inventory: Inventory;
  customer: Customer;
  address: Address;
}
export interface Warranty {
  warrantyDetails: WarrantyDetails;
}

export interface WarrantyResponse {
  warranty: Warranty[];
}

//---------------------------------------

export interface WarrantyDetailGetProps {
  id: string;
  type: string;
  createDate: Date;
  startDate: Date;
  completionDate: string;
  status: string;
  description: string;
  comments: string;
  nextMaintenanceDate: Date;
  warrantyId: string;
  staff: Staff;
  componentChange: ComponentChange[];
}

interface Staff {
  id: string;
  fullName: string;
  role: string;
}

// interface InventoryChange {
//   warrantyDetailId: string;
//   oldInventory: Inventory;
//   newInventory: Inventory;
// }

interface Inventory {
  id: string;
  serialNumber: string;
  type: string;
  componentName: string;
}

interface ComponentChange {
  image: string;
  createDate: Date;
  component: ComponentNew;
}
interface ComponentNew {
  id: string;
  name: string;
  description: string;
  status: string;
  stockPrice: number;
  sellingPrice: number;
}
