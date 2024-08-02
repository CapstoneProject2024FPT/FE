export enum StatusType {
  ALL = "all",
  UNPAID = "UnPaid",
  PAID = "Paid",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  DELIVERY = "Delivery",
  REDELIVERY = "ReDelivery",
}

export const statusMapping = [
  {
    id: StatusType.ALL,
    name: "Tất cả",
  },
  {
    id: StatusType.UNPAID,
    name: "Chưa thanh toán",
  },
  {
    id: StatusType.PAID,
    name: "Đã thanh toán",
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
    id: StatusType.DELIVERY,
    name: "Đang vận chuyển",
  },
  {
    id: StatusType.REDELIVERY,
    name: "Vận Chuyển Lại",
  },
];

export interface GetOrderProps {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: OrderProps[];
}

export interface OrderProps {
  orderId: string;
  invoiceCode: string;
  createDate: Date;
  completedDate: Date;
  productList: ProductDetail[];
  totalAmount: number;
  finalAmount: number;
  noteStatus: {
    SUCCESS: 0;
    FAILED: 1;
  };
  note: noteDetail[];
  status: string;
  userInfo: UserInfo;
  description: string;
  address: AddressDetail;
}

interface noteDetail {
  id: string;
  status: string;
  description: string;
  createDate: Date;
}

export interface ProductProps {
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  inventoryId: string;
}

export interface AddressDetail {
  id: string;
  name: string;
  status: string;
  note: string;
  city: CityDetail;
  district: DistrictDetail;
  ward: WardDetail;
}
interface ProductDetail {
  orderDetailId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  inventoryId: string;
}

interface CityDetail {
  id: string;
  unitId: number;
  name: string;
}
interface DistrictDetail {
  id: string;
  unitId: number;
  name: string;
}
interface WardDetail {
  id: string;
  unitId: number;
  name: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  role: string;
}

export type OrderStatus =
  | "Paid"
  | "UnPaid"
  | "Completed"
  | "Canceled"
  | "Delivery"
  | "ReDelivery";
export interface OrderCount {
  tolalOrders: number;
  ordersByStatus: {
    Paid: number;
    UnPaid: number;
    Completed: number;
    Canceled: number;
    Delivery: number;
  };
  totalRevenue: number;
  totalProfit: number;
}
