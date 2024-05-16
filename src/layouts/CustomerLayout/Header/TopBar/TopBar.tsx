import React, { useEffect, useState } from "react";
import Logo from "../../../../components/Logo/Logo";
import "./TopBar.scss";
import NavMenu from "../NavMenu/NavMenu";
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);

    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  return (
    <>
      <table className="nav-main-tbl">
        <tbody>
          <tr>
            <th className="logo_container" style={{ width: "40%" }}>
              <LogoContainer />
            </th>

            <th className="nav_container" style={{ width: "20%" }}>
              <NavMenu />
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
