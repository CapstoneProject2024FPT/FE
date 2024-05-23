import { Link } from "react-router-dom";
import { MenuSideBar } from "../../../../models/MenuSidebar";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import config from "../../../../configs";

const MenuSideBars: MenuSideBar[] = [
  {
    label: <Link to={config.adminRoutes.dashboard}>Dashboard</Link>,
    key: config.adminRoutes.dashboard,
    icon: <PieChartOutlined />,
  },
  {
    label: <Link to={config.adminRoutes.user}>User</Link>,
    key: config.adminRoutes.user,
    icon: <UserOutlined />,
  },
  {
    label: "Products",
    key: "products",
    icon: <ShoppingOutlined />,
    children: [
      {
        label: "All Products",
        key: "all_products",
      },
      {
        label: "Add Product",
        key: "add_product",
      },
    ],
  },
  {
    label: "Blogs",
    key: "blogs",
    icon: <ShoppingOutlined />,
    children: [
      {
        label: "All Blogs",
        key: "all_blogs",
      },
      {
        label: <Link to={config.adminRoutes.create}>Create</Link>,
        key: "create_blog",
      },
    ],
  },
];

export default MenuSideBars;
