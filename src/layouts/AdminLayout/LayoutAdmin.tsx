import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet } from "react-router-dom";
import { menuItems } from "./Header/SideBarAdmin/sidebarMenu";
import HeaderAdmin from "./Header/Header";
import Logo from "../../components/logo/Logo";
import "./LayoutAdmin.scss";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        style={{
          background: "white",
          borderRight: "1px solid rgba(132, 136, 132, 0.3 )",
          transform: " scaleY(1)",
        }}
      >
        <div className="demo-logo-vertical">
          <Logo />
        </div>
        <Menu mode="inline" defaultSelectedKeys={["/"]} items={menuItems} />
      </Sider>
      <Layout>
        <HeaderAdmin isCollapse={collapsed} handleCollapsed={handleCollapsed} />

        <Content style={{ margin: "24px 16px 0", height: "100%" }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
