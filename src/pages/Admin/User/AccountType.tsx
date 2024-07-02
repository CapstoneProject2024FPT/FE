import CustomerData from "./Table/TableCustomer/Customer";
import ManagerData from "./Table/TableManager/Manager";
import StaffSale from "./Table/TableStaffSale/StaffSale";
import StaffTechnical from "./Table/TableStaffTechnical/StaffTechnical";
interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}

const TabValue: TabValueProps[] = [
  { label: "Khách hàng", key: "1", children: <CustomerData /> },
  { label: "Nhân Viên Kĩ Thuật", key: "2", children: <StaffTechnical /> },
  { label: "Nhân Viên Bán Hàng", key: "3", children: <StaffSale /> },
  { label: "Quản Lí", key: "4", children: <ManagerData /> },
];

export default TabValue;
