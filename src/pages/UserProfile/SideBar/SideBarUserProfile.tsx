import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import CachedIcon from "@mui/icons-material/Cached";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EngineeringIcon from "@mui/icons-material/Engineering";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link } from "react-router-dom";

const SideBarUserProfile: React.FC = () => {
  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: "10px",
          border: "1px solid ",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ borderRadius: "10px" }}
          >
            Tên người dùng
          </ListSubheader>
        }
      >
        <div style={{ width: "auto" }}>
          <ListItemButton component={Link} to="/user">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Thông tin tài khoản" />
          </ListItemButton>
          <ListItemButton component={Link} to="/order-management">
            <ListItemIcon>
              <CachedIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý đơn hàng" />
          </ListItemButton>
          <ListItemButton component={Link} to="/favorite-product">
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            <ListItemText primary="Sản phẩm yêu thích" />
          </ListItemButton>
          <ListItemButton component={Link} to="/maintenance">
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText primary="Bảo trì" />
          </ListItemButton>
        </div>
      </List>
    </>
  );
};

export default SideBarUserProfile;
