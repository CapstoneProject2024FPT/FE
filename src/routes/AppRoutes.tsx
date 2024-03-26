import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Layout from "../layouts/Layout";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route key="login" path={config.routes.login} element={<Login />}></Route>
      <Route
        key="register"
        path={config.routes.register}
        element={<Register />}
      ></Route>
      <Route path={config.routes.home} element={<Layout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
