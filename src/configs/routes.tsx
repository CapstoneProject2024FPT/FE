import suffix from "./suffixRoute";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
  userProfile: "/user",
  maintenance: "/maintenance",
  orderManagement: "/order-management",
  favoriteProduct: "/favorite-product",
  notFound: "notFound",
  paymentSuccessfull: "/payment-successfull",
  news: "news",
  newsDetail: `news/${suffix.detailId}`,
  productList: "/product-list",
  productDetail: `/product-list/product-detail/${suffix.detailId}`,
};

export const adminRoutes = {
  dashboard: "/dashboard",
  user: "/dashboard/user",
  blogs: "/dashboard/news",
  blog: `/dashboard/new/${suffix.detailId}`,
  createNew: "/dashboard/create/new",
  editNew: `/dashboard/edit/new/${suffix.detailId}`,
  product: "/dashboard/product",
  createProduct: "/dashboard/create/product",
  viewDetailProduct: "/dashboard/product/:id",
  profile: "/dashboard/user/account",
  category: "/dashboard/categories",
  order: "/dashboard/orders",
};
