import TableCancel from "./TableCancel/TableCancel";
import TableComplete from "./TableComplete/TableComplete";
import TableDelivery from "./TableDelivery/TableDelivery";
import TablePaid from "./TablePaid/TablePaid";
import TableRedelivery from "./TableRedelivery/TableRedelivery";
import TableUnPaid from "./TableUnPaid/TableUnpaid";

interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
  roles?: string[] | null;
}

export const TabValue: TabValueProps[] = [
  {
    label: "Đã thanh toán",
    key: "1",
    children: <TablePaid />,
  },
  {
    label: "Hoàn thành",
    key: "2",
    children: <TableComplete />,
  },
  {
    label: "Đang vận chuyển",
    key: "3",
    children: <TableDelivery />,
  },
  {
    label: "Vận chuyển lại",
    key: "4",
    children: <TableRedelivery />,
  },
  {
    label: "Chưa thanh toán",
    key: "5",
    children: <TableUnPaid />,
  },
  {
    label: "Huỷ đơn",
    key: "6",
    children: <TableCancel />,
  },
];
