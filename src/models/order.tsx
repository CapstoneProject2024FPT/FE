export enum StatusType {
  PENDING = "Pending",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  CONFIRMED = "Confirmed",
}

export const statusMapping = [
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
    id: StatusType.CONFIRMED,
    name: "Đã xác nhận",
  },
];

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
  address: AddressDetail;
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
