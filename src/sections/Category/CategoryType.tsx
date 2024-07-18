import TableCategoryComponent from "./CategoryComponent/TableCategoryComponent";
import TableCategoryMachinery from "./CategoryMachinery/TableCategoryMachinery";

interface TabValueProps {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}
export const TabValueCategory: TabValueProps[] = [
  {
    label: "Tên loại máy",
    key: "1",
    children: <TableCategoryMachinery />,
  },
  {
    label: "Tên loại bộ phận",
    key: "2",
    children: <TableCategoryComponent />,
  },
];
