import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./Header/TopBar/TopBar";
import "./Layout.scss";
import "../../styles/main.scss";
import Footer from "./Footer/Footer";

const Layout: React.FC = () => {
  return (
    <div style={{ margin: "0px" }}>
      <TopBar />
      <div className="main-content" style={{ marginTop: "20px" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
