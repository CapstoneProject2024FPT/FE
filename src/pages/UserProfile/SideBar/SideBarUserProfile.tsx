import React from "react";
import { useLocation, Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import CachedIcon from "@mui/icons-material/Cached";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EngineeringIcon from "@mui/icons-material/Engineering";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import Iconify from "../../../components/Iconify";
import config from "../../../configs";

const SideBarUserProfile: React.FC = () => {
  const location = useLocation();

  const getActiveStyle = (path: string) => ({
    backgroundColor:
      location.pathname === path ? "rgba(0, 0, 0, 0.08)" : "inherit",
  });

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: "10px",
          border: "1px solid",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ borderRadius: "10px" }}
            sx={{ position: "static" }}
          >
            Tên người dùng
          </ListSubheader>
        }
      >
        <div style={{ width: "auto" }}>
          <ListItemButton
            component={Link}
            to={config.routes.userProfile}
            sx={getActiveStyle(config.routes.userProfile)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Thông tin tài khoản" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to={config.routes.userChangePassword}
            sx={getActiveStyle(config.routes.userChangePassword)}
          >
            <ListItemIcon>
              <Iconify icon={"ic:round-vpn-key"} width={20} height={20} />
            </ListItemIcon>
            <ListItemText primary="Đổi mật khẩu" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to={config.routes.userAddress}
            sx={getActiveStyle(config.routes.userAddress)}
          >
            <ListItemIcon>
              <Iconify
                icon={"mdi:address-marker-outline"}
                width={20}
                height={20}
              />
            </ListItemIcon>
            <ListItemText primary="Địa chỉ" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to={config.routes.orderManagement}
            sx={getActiveStyle(config.routes.orderManagement)}
          >
            <ListItemIcon>
              <CachedIcon />
            </ListItemIcon>
            <ListItemText primary="Lịch sử mua hàng" />
          </ListItemButton>
          {/* <ListItemButton
            component={Link}
            to={config.routes.favoriteProduct}
            sx={getActiveStyle(config.routes.favoriteProduct)}
          >
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            <ListItemText primary="Sản phẩm yêu thích" />
          </ListItemButton> */}
          <ListItemButton
            component={Link}
            to={config.routes.maintenance}
            sx={getActiveStyle(config.routes.maintenance)}
          >
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText primary="Bảo hành" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to={config.routes.transaction}
            sx={getActiveStyle(config.routes.transaction)}
          >
            <ListItemIcon>
              <Iconify
                icon={"ant-design:transaction-outlined"}
                width={20}
                height={20}
              />
            </ListItemIcon>
            <ListItemText primary="Giao dịch" />
          </ListItemButton>
        </div>
      </List>
    </>
  );
};

export default SideBarUserProfile;
