import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import config from "../configs";
import { Role } from "./Roles";

const CheckRoute: React.FC = () => {
  const { role, isLoading } = useAuthContext();
  const location = useLocation();
  let redirectTo: string | null = null;

  console.log("Current Path:", location.pathname);
  console.log("Role:", role);
  console.log("Is Loading:", isLoading);

  console.log("Redirect1", redirectTo);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role) {
    switch (role) {
      case Role.User:
        redirectTo = config.routes.home;
        break;
      case Role.Admin:
      case Role.Manager:
        redirectTo = config.adminRoutes.dashboard;
        break;
      case Role.Sale:
        redirectTo = config.adminRoutes.user;
        break;
      default:
        break;
    }
  }

  console.log("Redirect2", redirectTo);

  console.log("Redirect3", location.pathname !== redirectTo);

  console.log("Redirect4", redirectTo && location.pathname !== redirectTo);

  if (redirectTo && location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default CheckRoute;
