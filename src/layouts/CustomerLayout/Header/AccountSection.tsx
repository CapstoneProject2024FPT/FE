import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Logout from "@mui/icons-material/Logout";
import config from "../../../configs";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";

const AccountSection = () => {
  const jsonString = localStorage.getItem("loginInfo");
  const user = JSON.parse(jsonString || "{}");
  const [name, setName] = React.useState(user?.fullName ? user.fullName : "U");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const setAbrevName = () => {
    const temp = name.substring(0, 1) || "";
    setName(temp);
  };

  React.useEffect(() => {
    setAbrevName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("loginInfo");
    setTimeout(() => {
      navigate(config.routes.home);
    }, 500);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Link to={config.routes.cart}>
          <Button startIcon={<ShoppingCartIcon />} variant="outlined">
            Giỏ hàng
          </Button>
        </Link>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{name}</Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        sx={{
          padding: "10px",
          overflow: "visible",

          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 20,
            ml: -0.5,
            mr: 1,
            zIndex: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link to="" style={{ textDecoration: "none", color: "inherit" }}>
            Profile
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountSection;
