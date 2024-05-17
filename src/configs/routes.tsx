import suffix from "./suffixRoute";

const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  detail: `detail/${suffix.detailId}`,
  cart: "/cart",
};

export default routes;
