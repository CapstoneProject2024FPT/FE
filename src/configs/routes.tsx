
import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
  userProfile: "/user",
  notFound: "notFound",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "user",
};
