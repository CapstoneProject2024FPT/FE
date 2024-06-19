import React from "react";
import Logo from "../../../../components/Logo/Logo";

import RightMenu from "../RightMenu/RightMenu";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./TopBar.module.scss";
import SearchBar from "../SearchBar/SearchBar";

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
          <SearchBar />
          <RightMenu />
        </div>
        <nav className={cx("main-nav")}>
          <a href="#">LOẠI MÁY </a>
          <a href="#">TIN TỨC</a>
        </nav>
      </header>
    </>
  );
};

export default TopBar;
