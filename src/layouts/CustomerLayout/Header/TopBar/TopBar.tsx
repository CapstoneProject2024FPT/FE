import React, { useEffect, useState } from "react";
import Logo from "../../../../components/Logo/Logo";

import RightMenu from "../RightMenu/RightMenu";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./TopBar.module.scss";
import SearchBar from "../SearchBar/SearchBar";
import { CategoryApi } from "../../../../api/services/apiCategories";
import { GetCategoryProps } from "../../../../models/category";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { blue } from "@mui/material/colors";

const cx = classNames.bind(styles);

const LogoContainer = () => {
  return (
    <Link to="/">
      <Logo />
    </Link>
  );
};

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { getCategory } = CategoryApi();
  const [menuData, setMenuData] = useState<GetCategoryProps[]>([]);

  const fetchCategory = async () => {
    const response = await getCategory();
    setMenuData(response);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleCategoryClick = (categoryId?: string) => {
    const query = categoryId ? `?CategoryId=${categoryId}` : "";
    const targetPath = `/product-list${query}`;
    if (location.pathname === targetPath) {
      window.location.href = targetPath;
    } else {
      navigate(targetPath);
    }
  };

  const renderMenu = (data: GetCategoryProps[]) => {
    return (
      <ul className={cx("menu")}>
        <li
          className={cx("menu-item")}
          style={{ height: "54px", alignContent: "center" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation()
            handleCategoryClick();
          }}
        >
          <span>LOẠI MÁY</span>
          <ul className={cx("submenu")}>
            {data
              .filter(
                (item) => item.status === "Active" && item.type === "Parent"
              )
              .map((item) => (
                <li key={item.id} className={cx("submenu-item")}>
                  <span
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Link
                      to={`#${item.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        padding: "0",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                        handleCategoryClick(item.id);
                      }}
                    >
                      {item.name}
                    </Link>
                    {renderChildren(item.id) && (
                      <ArrowRightIcon sx={{ color: blue[500] }} />
                    )}
                  </span>
                  {renderChildren(item.id)}
                </li>
              ))}
          </ul>
        </li>
      </ul>
    );
  };

  const renderChildren = (parentId: string) => {
    const children = menuData.filter(
      (item) =>
        item.masterCategoryId === parentId &&
        item.type === "Child" &&
        item.status === "Active"
    );
    if (children.length > 0) {
      return (
        <ul className={cx("submenu")}>
          {children.map((child) => (
            <li key={child.id} className={cx("submenu-item")}>
              <span style={{ color: "black" }}>
                <Link
                  to={`#${child.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "0",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                    handleCategoryClick(child.id);
                  }}
                >
                  {child.name}
                </Link>
              </span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };
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
          {renderMenu(menuData)}

          <a href="#">TIN TỨC</a>
        </nav>
      </header>
    </>
  );
};

export default TopBar;
