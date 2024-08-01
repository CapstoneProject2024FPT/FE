import { MessageNotice, AdminMessageNotice } from "./message";
import { routes, adminRoutes } from "./routes";
import suffix from "./suffixRoute";

const config = {
  routes,
  adminRoutes,
  suffix,
  MessageNotice,
  AdminMessageNotice,
};

export default config;
