import * as React from "react";
import { Tabs } from "antd";
import { TabValue } from "../User/AccountType";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
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
    <Container>
      <HeaderBreadcrumbs
        heading="Tài Khoản"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tài khoản" },
        ]}
      />
      <Tabs type="card" defaultActiveKey="1" items={tabItems} />
    </Container>
  );
};

export default Account;
