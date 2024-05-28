import React from "react";
import Logo from "../../../../components/Logo/Logo";

import RightMenu from "../RightMenu/RightMenu";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./TopBar.module.scss";

const cx = classNames.bind(styles);

const LogoContainer = () => {
  return (
    <Link to="/">
      <Logo />
    </Link>
  );
};

const TopBar: React.FC = () => {
  return (
    <>
      <header className={cx("wrapper")}>
        <div className={cx("inner")}>
          <div className={cx("logo")}>
            <LogoContainer />
          </div>
          <RightMenu />
        </div>
      </header>
    </>
  );
};

export default TopBar;
