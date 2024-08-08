import { WarrantyDetailProps } from "./warranty";

export interface DeliveryPropsPost {
  type: string;
  warrantyDetailId?: string;
  orderId?: string;
  accountId: string;
  excutionDate: string;
}

export interface GetTaskProps {
  id: string;
  type: string;
  createDate: Date;
  status: string;
  completedDate: Date;
  warrantyDetail: WarrantyDetailProps;
  excutionDate: Date;
  order: {
    id: string;
    invoiceCode: string;
    note: string;
    finalAmount: number;
  };
  staff: {
    id: string;
    fullName: string;
    role: string;
  };
  address: {
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
  };
}

export enum StatusTaskType {
  PROCESS = "Process",
  COMPLETED = "Completed",
}

export const statusTaskMapping = [
  {
    id: StatusTaskType.PROCESS,
    name: "Đang Tiến hành",
  },
  {
    id: StatusTaskType.COMPLETED,
    name: "Hoàn thành",
  },
];

export interface StaffTaskProps {
  staffId: string;
  staffName: string;
  todayTaskStatusCount: {
    Process: number;
    Completed: number;
  };
  taskStatusCount: {
    Process: number;
    Completed: number;
  };
}
