import React, { useState } from "react";
import styles from "./SignIn.module.scss";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import classNames from "classnames/bind";
import Logo from "../../components/Logo/Logo";
import config from "../../configs";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
const Login: React.FC = () => {
  const [type, setType] = useState("signIn");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnClick = (text: any) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  return (
    <div className={cx("App")}>
      <div
        className={cx("container", {
          "right-panel-active": type === "signUp",
        })}
        id="container"
      >
        <SignUpForm />
        <SignInForm />
        <div className={cx("overlay-container")}>
          <div className={cx("overlay")}>
            <div className={cx("overlay-panel", "overlay-left")}>
              <Link to={config.routes.home}>
                <Logo />
              </Link>
              <h1>Chào mừng</h1>
              <p>
                Để có thể nhận được những ưu đãi hãy đăng kí bằng thông tin của
                bạn
              </p>
              <button
                className={cx("btn", "ghost")}
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Đăng Nhập
              </button>
            </div>
            <div className={cx("overlay-panel", "overlay-right")}>
              <Link to={config.routes.home} style={{ marginBottom: "15px" }}>
                <Logo />
              </Link>
              <h1>Chào, Bạn!</h1>
              <p>Hãy Đăng Nhập Để có thể bắt đầu</p>
              <button
                className={cx("btn", "ghost")}
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Đăng kí
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
