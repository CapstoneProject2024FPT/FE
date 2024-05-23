import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
  notFound: "notFound",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "user",
  blogs: "blog",
  blog: `blog/${suffix.detailId}`,
  create: "create",
};
