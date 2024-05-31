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
          <a href="#">MÁY MỚI</a>
          <a href="#">MÁY QUA SỬ DỤNG</a>
          <a href="#">DỤNG CỤ & PHỤ TÙNG</a>
          <a href="#">DẦU CẮT GỌT</a>
          <a href="#">DỊCH VỤ</a>
        </nav>
      </header>
    </>
  );
};

export default TopBar;
