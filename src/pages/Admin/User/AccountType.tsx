import CustomerData from "./Table/TableCustomer/Customer";
import CustomerInfo from "./Table/TableCustomer/Customer/CustomerInfo";
import CustomerTransaction from "./Table/TableCustomer/Customer/CustomerTransaction";
import ManagerData from "./Table/TableManager/Manager";
import StaffSale from "./Table/TableStaffSale/StaffSale";
import StaffTechnical from "./Table/TableStaffTechnical/StaffTechnical";
import { RoleType } from "../../../models/UserData";
interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
  roles?: string[] | null;
}

export const TabValue: TabValueProps[] = [
  {
    label: "Khách hàng",
    key: "1",
    children: <CustomerData />,
    roles: [RoleType.MANAGER, RoleType.ADMIN, RoleType.SALE],
  },
  {
    label: "Nhân Viên Kĩ Thuật",
    key: "2",
    children: <StaffTechnical />,
    roles: [RoleType.MANAGER, RoleType.ADMIN],
  },
  {
    label: "Nhân Viên Bán Hàng",
    key: "3",
    children: <StaffSale />,
    roles: [RoleType.MANAGER, RoleType.ADMIN],
  },
  {
    label: "Quản Lí",
    key: "4",
    children: <ManagerData />,
    roles: [RoleType.ADMIN],
  },
];

export const TabValueCustomerDetail: TabValueProps[] = [
  { label: "Thông tin Khách hàng", key: "1", children: <CustomerInfo /> },
  { label: "Thông tin giao dịch", key: "2", children: <CustomerTransaction /> },
];
