import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
  userProfile: "/user",
  notFound: "notFound",
  paymentSuccessfull: "/payment-successfull",
  news: "news",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "user",
  blogs: "news",
  blog: `new/${suffix.detailId}`,
  createNew: "create/new",
  editNew: `edit/new/${suffix.detailId}`,
  product: "product",
  createProduct: "create/product",
  profile: "user/account",
};
