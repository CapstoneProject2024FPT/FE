import { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export interface MenuSideBar {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
}
