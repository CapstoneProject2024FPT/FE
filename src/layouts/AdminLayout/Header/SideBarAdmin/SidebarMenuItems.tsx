import { Link } from "react-router-dom";
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
import Iconify from "../../../../components/Iconify";
import { RoleType } from "../../../../models/UserData";
import { CustomMenuItem } from "../../../../models/MenuSidebar";

const AccessType = {
  ALL_ACCESS: [RoleType.MANAGER, RoleType.ADMIN, RoleType.SALE],
  ADMIN_MANAGER_ACCESS: [RoleType.MANAGER, RoleType.ADMIN],
  ADMIN_ACCESS: [RoleType.ADMIN],
};

const MenuSideBars: CustomMenuItem[] = [
  {
    label: <Link to={config.adminRoutes.dashboard}>Thống Kê</Link>,
    key: config.adminRoutes.dashboard,
    icon: <PieChartOutlined />,
    roles: AccessType.ALL_ACCESS,
  },
  {
    label: <Link to={config.adminRoutes.user}>Người dùng</Link>,
    key: config.adminRoutes.user,
    icon: <UserOutlined />,
    roles: AccessType.ALL_ACCESS,
  },
  {
    label: "Sản Phẩm",
    key: "products",
    icon: <ShoppingOutlined />,
    roles: AccessType.ALL_ACCESS,
    children: [
      {
        label: <Link to={config.adminRoutes.product}>Tất cả máy</Link>,
        key: config.adminRoutes.product,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.createProduct}>Thêm sản phẩm</Link>,
        key: config.adminRoutes.createProduct,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.viewMachineComponent}>
            Tất cả chi tiết máy
          </Link>
        ),
        key: config.adminRoutes.viewMachineComponent,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.createMachineComponent}>
            Tạo mới chi tiết máy
          </Link>
        ),
        key: config.adminRoutes.createMachineComponent,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.category}>Loại máy</Link>,
        key: config.adminRoutes.category,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.brand}>Thương hiệu</Link>,
        key: config.adminRoutes.brand,
        roles: AccessType.ALL_ACCESS,
      },
    ],
  },

  {
    label: "Tin tức",
    key: "news",
    icon: <ContainerOutlined />,
    roles: AccessType.ALL_ACCESS,
    children: [
      {
        label: <Link to={config.adminRoutes.blogs}>Tất cả tin tức</Link>,
        key: config.adminRoutes.blogs,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.createNew}>Thêm mới tin tức</Link>,
        key: config.adminRoutes.createNew,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.newsCategory}>Thể Loại Tin tức</Link>
        ),
        key: config.adminRoutes.newsCategory,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: "Đơn hàng",
    key: "orders",
    icon: <ReceiptLongIcon />,
    roles: AccessType.ADMIN_MANAGER_ACCESS,
    children: [
      {
        label: <Link to={config.adminRoutes.order}>Tất cả đơn hàng</Link>,
        key: config.adminRoutes.order,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: "Bảo trì",
    key: "warranty",
    icon: <EngineeringIcon />,
    roles: AccessType.ADMIN_MANAGER_ACCESS,
    children: [
      {
        label: (
          <Link to={config.adminRoutes.maintenance}>Bảo hành định kì</Link>
        ),
        key: config.adminRoutes.maintenance,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.maintenanceRequest}>
            Yêu cầu bảo hành
          </Link>
        ),
        key: config.adminRoutes.maintenanceRequest,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: <Link to={config.adminRoutes.rank}>Hạng mức</Link>,
    key: "rank",
    icon: <TransactionOutlined />,
    roles: AccessType.ADMIN_MANAGER_ACCESS,
  },
  {
    label: <Link to={config.adminRoutes.task}>Nhiệm vụ</Link>,
    key: "task",
    icon: <Iconify icon={"mingcute:task-2-fill"} />,
    roles: AccessType.ADMIN_MANAGER_ACCESS,
  },
];

export default MenuSideBars;
