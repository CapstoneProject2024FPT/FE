import React from "react";
import Logo from "../../../../components/logo/Logo";
import "./TopBar.scss";
import RightMenu from "../RightMenu/RightMenu";
import { Link } from "react-router-dom";

const LogoContainer = () => {
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: "20px",
      }}
    >
      <Logo />
    </Link>
  );
};

const TopBar: React.FC = () => {
  return (
    <>
      <table className="nav-main-tbl">
        <tbody>
          <tr>
            <th className="logo_container" style={{ width: "40%" }}>
              <LogoContainer />
            </th>
            <th className="menu_container" style={{ width: "40%" }}>
              <RightMenu />
            </th>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TopBar;
