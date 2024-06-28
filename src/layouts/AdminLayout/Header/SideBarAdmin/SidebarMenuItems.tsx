import { Link } from "react-router-dom";
import { MenuSideBar } from "../../../../models/MenuSidebar";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EngineeringIcon from "@mui/icons-material/Engineering";
import config from "../../../../configs";

const MenuSideBars: MenuSideBar[] = [
  {
    label: <Link to={config.adminRoutes.dashboard}>Thống Kê</Link>,
    key: config.adminRoutes.dashboard,
    icon: <PieChartOutlined />,
  },
  {
    label: <Link to={config.adminRoutes.user}>Người dùng</Link>,
    key: config.adminRoutes.user,
    icon: <UserOutlined />,
  },
  {
    label: "Sản Phẩm",
    key: "products",
    icon: <ShoppingOutlined />,
    children: [
      {
        label: <Link to={config.adminRoutes.product}>Tất cả sản phẩm</Link>,
        key: config.adminRoutes.product,
      },
      {
        label: <Link to={config.adminRoutes.createProduct}>Thêm sản phẩm</Link>,
        key: config.adminRoutes.createProduct,
      },
      {
        label: <Link to={config.adminRoutes.category}>Loại máy</Link>,
        key: config.adminRoutes.category,
      },
      {
        label: <Link to={config.adminRoutes.brand}>Thương hiệu</Link>,
        key: config.adminRoutes.brand,
      },
    ],
  },

  {
    label: "Tin tức",
    key: "news",
    icon: <ContainerOutlined />,
    children: [
      {
        label: <Link to={config.adminRoutes.blogs}>Tất cả tin tức</Link>,
        key: config.adminRoutes.blogs,
      },
      {
        label: <Link to={config.adminRoutes.createNew}>Thêm mới tin tức</Link>,
        key: config.adminRoutes.createNew,
      },
    ],
  },
  {
    label: "Đơn hàng",
    key: "orders",
    icon: <ReceiptLongIcon />,
    children: [
      {
        label: <Link to={config.adminRoutes.order}>Tất cả đơn hàng</Link>,
        key: config.adminRoutes.order,
      },
    ],
  },
  {
    label: "Bảo trì",
    key: "warranty",
    icon: <EngineeringIcon />,
    children: [
      {
        label: <Link to={config.adminRoutes.maintenance}>Tất cả đơn hàng</Link>,
        key: config.adminRoutes.maintenance,
      },
    ],
  },
  {
    label: <Link to={config.adminRoutes.rank}>Hạng mức</Link>,
    key: "rank",
    icon: <TransactionOutlined />,
  },
];

export default MenuSideBars;
