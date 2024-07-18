import TablePeriodicWarranty from "./PeriodicWarranty/PeriodicWarranty";
import TableRequestWarranty from "./RequestWarranty/RequestWarranty";

interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}
export const TabValueCategory: TabValueProps[] = [
  {
    label: "Bảo hành định kì",
    key: "1",
    children: <TablePeriodicWarranty />,
  },
  {
    label: "Bảo hành theo yêu cầu",
    key: "2",
    children: <TableRequestWarranty />,
  },
];
