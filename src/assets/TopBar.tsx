import React, { useEffect, useState } from "react";
import Logo from "../../components/Logo/Logo";
import "./TopBar.scss";
import NavMenu from "../Header/NavMenu/NavMenu";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Box, IconButton } from "@mui/material";

const LogoContainer = () => {
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: "20px",
      }}
    >
      <Logo />
    </Link>
  );
};

const TopBar: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);

    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  const DrawerList: React.ReactElement = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {toggleMenu || screenWidth > 900 ? (
        <table className="nav-main-tbl">
          <tr>
            <th className="logo_container" style={{ width: "40%" }}>
              <LogoContainer />
            </th>

            <th className="nav_container" style={{ width: "20%" }}>
              <NavMenu />
            </th>
          </tr>
        </table>
      ) : (
        <table className="nav-main-tbl">
          <tr>
            <th>
              <LogoContainer />
            </th>

            <th>
              <div className="hamburger_container">
                <IconButton size="small" onClick={toggleDrawer(true)}>
                  <FiMenu />
                </IconButton>
              </div>
            </th>
          </tr>
        </table>
      )}
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </>
  );
};

export default TopBar;
