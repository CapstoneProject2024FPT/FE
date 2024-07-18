import * as React from "react";
import { Tabs } from "antd";
import { TabValueCategory } from "./CategoryType";

interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactElement;
}

const getItemTab = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: React.ReactElement
): TabItem => {
  return {
    key,
    label,
    icon,
    children,
  };
};

const TableCategory: React.FC = () => {
  const tabItems = TabValueCategory.map((item) => {
    return getItemTab(item.label, item.key, item.icon, item.children);
  });

  return <Tabs type="card" defaultActiveKey="1" items={tabItems} />;
};

export default TableCategory;
