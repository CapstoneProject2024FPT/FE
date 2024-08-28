import * as React from "react";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../../../components/HeaderBreadcrumbs";
import config from "../../../../../configs";
import { Tabs } from "antd";
import { TabValueCustomerDetail } from "../../AccountType";

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

const AccountDetailCustomer: React.FC = () => {
  const tabItems = TabValueCustomerDetail.map((item) => {
    return getItemTab(item.label, item.key, item.icon, item.children);
  });

  return (
    <Container style={{ width: "100%", maxWidth: "none" }}>
      <HeaderBreadcrumbs
        heading="Tài Khoản"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tài khoản", href: config.adminRoutes.user },
          { name: "Chi tiết tài khoản" },
        ]}
      />
      <Tabs type="card" defaultActiveKey="1" items={tabItems} />
    </Container>
  );
};

export default AccountDetailCustomer;
