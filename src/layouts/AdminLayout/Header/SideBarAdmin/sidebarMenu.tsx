import React from "react";
import type { MenuProps } from "antd";
import MenuSideBars from "./SidebarMenuItems";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

export const menuItems: MenuItem[] = MenuSideBars.map((item) =>
  getItem(item.label, item.key, item.icon, item.children, item.type)
);
