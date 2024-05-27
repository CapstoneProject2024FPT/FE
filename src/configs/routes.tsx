import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
  notFound: "notFound",
  paymentSuccessfull: "/payment-successfull",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "user",
  blogs: "blog",
  blog: `blog/${suffix.detailId}`,
  create: "create",
};
