import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
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
import CreateProduct from "../pages/Admin/Product/CreateProduct";
import Product from "../pages/Admin/Product/Product";
import BlogPosts from "../pages/Admin/Blog/BlogPosts";
import ProfileAccount from "../pages/Admin/Profile/Profile";
import Category from "../pages/Admin/Categories/Category";
import Order from "../pages/Admin/Order/Order";
import ViewProductDetail from "../pages/Admin/Product/ViewProductDetail";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* authen */}
      <Route key="login" path={config.routes.login} element={<Login />} />

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
        {/* news */}
        <Route
          key="new"
          path={config.adminRoutes.blogs}
          element={<BlogPosts />}
        />
        <Route
          key="createNew"
          path={config.adminRoutes.createNew}
          element={<BlogNewPost />}
        />

        {/* product */}
        <Route
          key="product"
          path={config.adminRoutes.product}
          element={<Product />}
        />
        <Route
          key="createProduct"
          path={config.adminRoutes.createProduct}
          element={<CreateProduct />}
        />
        <Route
          key="ProductDetail"
          path={config.adminRoutes.viewDetailProduct}
          element={<ViewProductDetail />}
        />

        {/* category */}
        <Route
          key="category"
          path={config.adminRoutes.category}
          element={<Category />}
        />
        {/* profile */}
        <Route
          key="profile"
          path={config.adminRoutes.profile}
          element={<ProfileAccount />}
        />

        {/* order */}
        <Route
          key="orders"
          path={config.adminRoutes.order}
          element={<Order />}
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
