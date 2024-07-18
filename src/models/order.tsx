export enum StatusType {
  UNPAID = "UnPaid",
  PAID = "Paid",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  DELIVERY = "Delivery",
}

export const statusMapping = [
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
    name: "Đã vận chuyển",
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
  note: string;
  status: string;
  userInfo: UserInfo;
  description: string;
  address: AddressDetail;
}

export interface ProductProps {
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
}

export interface AddressDetail {
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
