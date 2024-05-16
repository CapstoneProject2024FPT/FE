import CustomerData from "./Table/TableCustomer/Customer";
import ManagerData from "./Table/TableManager/Manager";
import StaffData from "./Table/TableStaff/Staff";

interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}

const TabValue: TabValueProps[] = [
  { label: "Khách hàng", key: "1", children: <CustomerData /> },
  { label: "Nhân Viên", key: "2", children: <StaffData /> },
  { label: "Quản Lí", key: "3", children: <ManagerData /> },
];

export default TabValue;
