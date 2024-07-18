import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Checkout from "../pages/Cart/Checkout";
import Dashboard from "../pages/Dashboard/Dashboard";
import LayoutAdmin from "../layouts/AdminLayout/LayoutAdmin";
import Account from "../pages/Admin/User/Account";
import Layout from "../layouts/CustomerLayout/Layout";
import UserProfile from "../pages/UserProfile/UserProfile";
import BlogNewPost from "../pages/Admin/Blog/BlogNewPost";
import PaymentSuccessfull from "../pages/Payment/successful";
import CreateProduct from "../pages/Admin/Product/CreateProduct";
import Product from "../pages/Admin/Product/Product";
import BlogPosts from "../pages/Admin/Blog/BlogPosts";
import ProfileAccount from "../pages/Admin/Profile/Profile";
import Category from "../pages/Admin/Categories/Category";
import Order from "../pages/Admin/Order/Order";
import Products from "../pages/Products/Products";
import Detail from "../pages/Products/ProductDetail/ProductDetail";
import ViewProductDetail from "../pages/Admin/Product/ViewProductDetail";
import Maintenance from "../pages/UserProfile/Warranty";
import OrderCustomer from "../pages/UserProfile/Order";
import FavoriteProduct from "../pages/UserProfile/FavoriteProduct";
import Page404 from "../pages/404/NotFoundPage";
import NewsDetail from "../pages/News/NewsDetail";
import Brand from "../pages/Admin/Brand/Brand";
import Rank from "../pages/Admin/Rank/Rank";
import SerialNumberPropductDetail from "../pages/Admin/Product/SerialNumberProduct";
import AccountDetailCustomer from "../pages/Admin/User/Table/TableCustomer/CustomerDetail";
import ChangePassword from "../pages/UserProfile/ChangePassword";
import NewsCategories from "../pages/Admin/NewsCategories/NewsCategories";
import BlogPostDetail from "../pages/Admin/Blog/BlogPostDetail";
import AccountDetail from "../pages/Admin/User/Table/AccountDetail";
import Address from "../pages/UserProfile/Address";
import News from "../pages/News/News";
import AboutUs from "../sections/About/AboutUs/AboutUs";
import PrivacyPolicy from "../sections/About/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../sections/About/TermsOfService/TermsOfService";
import PaymentFailure from "../pages/Payment/failure";
import CreateMachineComponent from "../pages/Admin/MachineComponent/CreateMachineComponent";
import MachineComponent from "../pages/Admin/MachineComponent/MachineComponent";
import MachineComponentDetail from "../pages/Admin/MachineComponent/MachineComponentDetail";
import SerialNumberComponent from "../pages/Admin/MachineComponent/SerialNumberComponent";
import KanBan from "../pages/Admin/Task/Task";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* authen */}
      <Route key="login" path={config.routes.login} element={<Login />} />

      {/* customer */}
      <Route key="customer" path={config.routes.home} element={<Layout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
        <Route
          key="productDetail"
          path={config.routes.productDetail}
          element={<Detail />}
        />
        <Route
          key="payment-successful"
          path={config.routes.paymentSuccessful}
          element={<PaymentSuccessfull />}
        ></Route>
        <Route
          key="payment-failure"
          path={config.routes.paymentFailure}
          element={<PaymentFailure />}
        ></Route>
        <Route key="cart" path={config.routes.cart} element={<Checkout />} />
        <Route
          key="user"
          path={config.routes.userProfile}
          element={<UserProfile />}
        />
        <Route
          key="changePassword"
          path={config.routes.userChangePassword}
          element={<ChangePassword />}
        />
        <Route
          key="Address"
          path={config.routes.userAddress}
          element={<Address />}
        />
        <Route
          key="productList"
          path={config.routes.productList}
          element={<Products />}
        />
        <Route key="listNews" path={config.routes.news} element={<News />} />
        <Route
          key="favoriteProduct"
          path={config.routes.favoriteProduct}
          element={<FavoriteProduct />}
        />
        <Route
          key="maintenance"
          path={config.routes.maintenance}
          element={<Maintenance />}
        />
        <Route
          key="orderManagement"
          path={config.routes.orderManagement}
          element={<OrderCustomer />}
        />
        <Route
          key="newDetail"
          path={config.routes.newsDetail}
          element={<NewsDetail />}
        />
        <Route
          key="aboutUs"
          path={config.routes.aboutUs}
          element={<AboutUs />}
        />
        <Route
          key="privacyPolicy"
          path={config.routes.privacyPolicy}
          element={<PrivacyPolicy />}
        />
        <Route
          key="termsOfService"
          path={config.routes.termsOfService}
          element={<TermsOfService />}
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
        {/* account  */}
        <Route
          key="user"
          path={config.adminRoutes.user}
          element={<Account />}
        />
        <Route
          key="userDetail"
          path={config.adminRoutes.userDetail}
          element={<AccountDetailCustomer />}
        />
        <Route
          key="accountDetail"
          path={config.adminRoutes.accountDetail}
          element={<AccountDetail />}
        />

        {/* news */}
        <Route
          key="new"
          path={config.adminRoutes.blogs}
          element={<BlogPosts />}
        />
        <Route
          key="createNews"
          path={config.adminRoutes.createNew}
          element={<BlogNewPost />}
        />
        <Route
          key="NewsDetail"
          path={config.adminRoutes.blog}
          element={<BlogPostDetail />}
        />
        {/* news Categories  */}
        <Route
          key="newCategories"
          path={config.adminRoutes.newsCategory}
          element={<NewsCategories />}
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
        <Route
          key="serialnumber"
          path={config.adminRoutes.viewSerialProduct}
          element={<SerialNumberPropductDetail />}
        />

        {/* component  */}
        <Route
          key="ProductComponent"
          path={config.adminRoutes.createMachineComponent}
          element={<CreateMachineComponent />}
        />
        <Route
          key="viewComponent"
          path={config.adminRoutes.viewMachineComponent}
          element={<MachineComponent />}
        />
        <Route
          key="viewComponentDetail"
          path={config.adminRoutes.viewDetailMachineComponent}
          element={<MachineComponentDetail />}
        />
        <Route
          key="viewComponentDetailSerial"
          path={config.adminRoutes.viewDetailMachineComponentSerial}
          element={<SerialNumberComponent />}
        />
        {/* category */}
        <Route
          key="category"
          path={config.adminRoutes.category}
          element={<Category />}
        />

        {/* brand  */}
        <Route
          key="brand"
          path={config.adminRoutes.brand}
          element={<Brand />}
        />

        {/* rank  */}
        <Route key="rank" path={config.adminRoutes.rank} element={<Rank />} />

        {/* task  */}
        <Route key="task" path={config.adminRoutes.task} element={<KanBan />} />

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
        element={<Page404 />}
      ></Route>
    </Routes>
  );
};

export default AppRoute;
