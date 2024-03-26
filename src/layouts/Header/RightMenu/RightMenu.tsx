import React from "react";
import "./RightMenu.scss";
import Button from "../../../components/Button/Button";
import { Link } from "react-router-dom";
import AccountSection from "../AccountSection";
import config from "../../../configs";
import { useAuthContext } from "../../../context/AuthContext";

const RightMenu: React.FC = () => {
  const { authUser } = useAuthContext();
  return (
    <>
      <div className="right_menu">
        <div className="item__user">
          {authUser ? (
            <>
              <AccountSection />
            </>
          ) : (
            <>
              <Link
                to={config.routes.login}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="secondary">Đăng nhập</Button>
              </Link>
              <Link
                to={config.routes.register}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button>Đăng kí</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RightMenu;
