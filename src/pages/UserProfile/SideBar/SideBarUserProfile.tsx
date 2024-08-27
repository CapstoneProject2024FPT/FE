import React from "react";
import { useLocation, Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import CachedIcon from "@mui/icons-material/Cached";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { List, ListItemButton, ListItemIcon, Typography } from "@mui/material";
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
      >
        <div style={{ width: "auto" }}>
          <ListItemButton
            style={{ marginTop: "10px" }}
            component={Link}
            to={config.routes.userProfile}
            sx={getActiveStyle(config.routes.userProfile)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <Typography sx={{ fontSize: "18px" }}>
              {" "}
              Thông tin tài khoản{" "}
            </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
            component={Link}
            to={config.routes.userChangePassword}
            sx={getActiveStyle(config.routes.userChangePassword)}
          >
            <ListItemIcon>
              <Iconify icon={"ic:round-vpn-key"} width={20} height={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "18px" }}> Đổi mật khẩu </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
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
            <Typography sx={{ fontSize: "18px" }}> Địa chỉ </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
            component={Link}
            to={config.routes.orderManagement}
            sx={getActiveStyle(config.routes.orderManagement)}
          >
            <ListItemIcon>
              <CachedIcon />
            </ListItemIcon>
            <Typography sx={{ fontSize: "18px" }}>
              {" "}
              Lịch sử mua hàng{" "}
            </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
            component={Link}
            to={config.routes.favoriteProduct}
            sx={getActiveStyle(config.routes.favoriteProduct)}
          >
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            <Typography sx={{ fontSize: "18px" }}>
              {" "}
              Sản phẩm yêu thích
            </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
            component={Link}
            to={config.routes.maintenance}
            sx={getActiveStyle(config.routes.maintenance)}
          >
            <ListItemIcon>
              <Iconify
                icon={"carbon:license-maintenance"}
                width={20}
                height={20}
              />
            </ListItemIcon>
            <Typography sx={{ fontSize: "18px" }}> Bảo hành </Typography>
          </ListItemButton>
          <ListItemButton
            style={{ marginTop: "10px" }}
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
            <Typography sx={{ fontSize: "18px" }}> Giao dịch </Typography>
          </ListItemButton>
        </div>
      </List>
    </>
  );
};

export default SideBarUserProfile;
