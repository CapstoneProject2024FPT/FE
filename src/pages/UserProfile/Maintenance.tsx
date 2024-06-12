import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
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
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";



const Maintenance: React.FC = () => {

    return (
        <>
            <Typography variant="h3" component="h2">
                Bảo trì
            </Typography>
            <div
                style={{
                    backgroundColor: "#ECF0F1",
                    borderRadius: "20px",
                    width: "65%",
                    height: "100%",
                }}
            >
                <Box sx={{ flexGrow: 1, margin: "2%", padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={3}>
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
                        </Grid>
                        <Grid xs={12} md={9}>
                            <Box sx={{ marginLeft: "5%" }}>
                                <Paper
                                    sx={{
                                        borderStyle: "none",
                                        padding: "20px",
                                        border: "1px solid ",
                                    }}
                                >


                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
};

export default Maintenance;
