import * as React from "react";
import { Tabs } from "antd";
import TabValue from "./AccountType";

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

const Account: React.FC = () => {
  const tabItems = TabValue.map((item) => {
    return getItemTab(item.label, item.key, item.icon, item.children);
  });

  return (
    <div style={{ height: "100%" }}>
      <Tabs type="card" defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default Account;
