import React from "react";
// import menuList from "../../Config/navMenuList";
import "./NavMenu.scss";
import "../../../../index.css";
// import { Link } from "react-router-dom";
const NavMenu: React.FC = () => {
  return (
    <div className="menu">
      {/* {menuList.map((item) => (
        <Link
          to={item.link}
          style={{ textDecoration: "None", color: "inherit" }}
        >
          <div className="menu__item">
            {item.icon}

          </div>
        </Link>
      ))} */}
    </div>
  );
};

export default NavMenu;
