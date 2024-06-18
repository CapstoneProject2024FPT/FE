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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ModalOrderPopup from "./PopupDetailOrder";
import { useState } from "react";
import { Link } from "react-router-dom";


const Order = [
    {
        ID: 1,
        orderID: "123456",
        orderDate: "2021-10-10",
        orderStatus: "Đang chờ",
        orderTotal: 1000000,
        orderDetail: [
            {
                productID: "1",
                productName: "Máy tiện",
                productPrice: 1000000,
                productQuantity: 1,
            }, {
                productID: "1",
                productName: "Máy tiện",
                productPrice: 1000000,
                productQuantity: 1,
            }, {
                productID: "1",
                productName: "Máy tiện",
                productPrice: 1000000,
                productQuantity: 1,
            },
        ],
    }, {
        ID: 2,
        orderID: "123457",
        orderDate: "2021-10-11",
        orderStatus: "Đã giao",
        orderTotal: 2000000,
        orderDetail: [
            {
                productID: "2",
                productName: "Máy khoan",
                productPrice: 2000000,
                productQuantity: 1,
            },
        ],
    }, {
        ID: 3,
        orderID: "123458",
        orderDate: "2021-10-12",
        orderStatus: "Đã hủy",
        orderTotal: 3000000,
        orderDetail: [
            {
                productID: "3",
                productName: "Máy xung điện",
                productPrice: 3000000,
                productQuantity: 1,
            },
        ],
    }

]


const OrderManagement: React.FC = () => {

    const [selectedData, setSelectedData] = useState<any>({});
    const [open, setOpen] = useState<boolean>(false);
    const handleCLose = () => {
        setOpen(!open);
    };
    const columns: GridColDef[] = [
        { field: 'ID', headerName: 'SI', width: 70 },
        { field: 'orderID', headerName: 'Mã đơn hàng', width: 130, filterable: false, sortable: false, disableColumnMenu: true },
        { field: 'orderDate', headerName: 'Ngày đặt hàng', width: 130 },
        { field: 'orderStatus', headerName: 'Trạng thái', width: 130, filterable: false, sortable: false, disableColumnMenu: true },
        { field: 'orderTotal', headerName: 'Tổng tiền', width: 130, filterable: false, sortable: false, disableColumnMenu: true },
        {
            field: 'orderDetail',
            headerName: 'Chi tiết đơn hàng',
            width: 130,
            renderCell: (data) => {
                return (
                    <div>
                        <button
                            style={{
                                backgroundColor: "#2ECC71",
                                color: "white",
                                padding: "5px 10px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setOpen(!open);
                                setSelectedData(data.row);
                            }}
                        >
                            Xem chi tiết

                        </button>
                    </div>
                );
            },

        },
    ];



    return (
        <>
            <Typography variant="h3" component="h2">
                Quản lý đơn hàng
            </Typography>
            <div
                style={{
                    backgroundColor: "#ECF0F1",
                    borderRadius: "20px",
                    width: "80%",
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
                                    <div style={{ height: 400, width: "100%" }}>
                                        <DataGrid
                                            rows={Order}
                                            getRowId={(row) => row.ID}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                            disableRowSelectionOnClick

                                        />
                                        {open && (<ModalOrderPopup
                                            orderData={selectedData}

                                            handleClose={handleCLose}
                                            open={open}
                                        />)}
                                    </div>

                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
};

export default OrderManagement;
