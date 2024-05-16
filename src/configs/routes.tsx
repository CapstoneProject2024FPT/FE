import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  notFound: "notFound",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "user",
};
