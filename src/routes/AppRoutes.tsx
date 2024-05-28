import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";

import Detail from "../pages/Detail/Detail";
import Cart from "../pages/Cart/Cart";
import Dashboard from "../pages/Dashboard/Dashboard";
import LayoutAdmin from "../layouts/AdminLayout/LayoutAdmin";
import Account from "../pages/Admin/User/Account";
import NotFoundPage from "../pages/404/NotFoundPage";
import Layout from "../layouts/CustomerLayout/Layout";
import UserProfile from "../pages/UserProfile/UserProfile";
import BlogNewPost from "../pages/Admin/Blog/BlogNewPost";
import PaymentSuccessfull from "../pages/PaymentSuccessfull";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* authen */}
      <Route key="login" path={config.routes.login} element={<Login />}></Route>
      <Route
        key="register"
        path={config.routes.register}
        element={<Register />}
      ></Route>

      {/* customer */}
      <Route key="customer" path={config.routes.home} element={<Layout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
        <Route key="detail" path={config.routes.detail} element={<Detail />} />
        <Route
          key="payment-successfull"
          path={config.routes.paymentSuccessfull}
          element={<PaymentSuccessfull />}
        ></Route>
        <Route key="cart" path={config.routes.cart} element={<Cart />} />
        <Route
          key="user"
          path={config.routes.userProfile}
          element={<UserProfile />}
        />
      </Route>

      {/* admin */}
      <Route
        key="admin"
        path={config.adminRoutes.dashboard}
        element={<LayoutAdmin />}
      >
        <Route
          key="dashboard"
          path={config.adminRoutes.dashboard}
          element={<Dashboard />}
        />
        <Route
          key="user"
          path={config.adminRoutes.user}
          element={<Account />}
        />
        <Route
          key="blog"
          path={config.adminRoutes.create}
          element={<BlogNewPost />}
        />
      </Route>

      <Route
        key="notfound"
        path={config.routes.notFound}
        element={<NotFoundPage />}
      ></Route>
    </Routes>
  );
};

export default AppRoute;
