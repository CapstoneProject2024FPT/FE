import { ProductAdmin } from "./products";

export enum StatusType {
  PENDING = "Pending",
  COMPLETED = "Complete",
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
}

interface Inventory {
  machinery: ProductAdmin;
  id: string;
  serialNumber: string;
  type: string;
}

export interface WarrantyPropsById extends WarrantyProps {
  warrantyDetail: WarrantyDetail[];
}

interface WarrantyDetail {
  id: string;
  status: string;
  createDate: Date;
  startDate: Date;
  description: string;
  comments: string;
  accountId: string;
  warrantyId: string;
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
