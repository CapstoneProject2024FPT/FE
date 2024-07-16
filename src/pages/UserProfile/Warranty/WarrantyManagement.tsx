import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button } from "@mui/material";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps, WarrantyPropsById, warrantyStatusMapping } from "../../../models/warranty";
import { formatDateFunc } from "../../../utils/fn";

const getStatusStyles = (status: string) => {
    switch (status) {
        case "Process":
            return { backgroundColor: "#FFD700", color: "black" }; // vàng
        case "AwaitingAssignment":
            return { backgroundColor: "#FFD700", color: "black" }; // vàng
        case "Complete":
            return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
        case "Cancele":
            return { backgroundColor: "#F44336", color: "white" }; // đỏ
        default:
            return { backgroundColor: "transparent", color: "black" };
    }
};

function Row(props: { row: WarrantyProps }) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const date = new Date(row.createDate);
    const [warrantyDetail, setWarrantyDetail] = useState<WarrantyPropsById>()
    const { apiGetWarrantyById } = ApiWarranty();


    const defaultStatus = "Đang chờ xác nhận";
    const StatusName = row?.status
        ? warrantyStatusMapping?.find((status) => status.id === row?.status)?.name
        : defaultStatus;

    const fetchWarrantyById = async () => {
        if (row) {
            const response = await apiGetWarrantyById(row.id);
            setWarrantyDetail(response.data);
        }

    };

    const handleClick = () => {
        setOpen(!open)
        fetchWarrantyById()
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={handleClick}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="right">{row.inventory.serialNumber}</TableCell>
                <TableCell align="right">{row.inventory.machinery.name}</TableCell>
                <TableCell align="right">
                    <Box
                        sx={{
                            ...getStatusStyles(row.status),
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "inline-block",
                        }}
                    >
                        {StatusName}
                    </Box>
                </TableCell>
                <TableCell align="right">{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Chi tiết yêu cầu
                            </Typography>
                            <Table size="medium" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày bắt đầu</TableCell>
                                        <TableCell align="right">Mô tả</TableCell>
                                        <TableCell align="right">Trạng thái</TableCell>
                                        <TableCell align="right">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Uncomment and adjust as needed */}
                                    {warrantyDetail?.warrantyDetail.map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell component="th" scope="row">
                                                {formatDateFunc.formatDate(detail.startDate)}
                                            </TableCell>
                                            <TableCell align="right">{detail.description}</TableCell>
                                            <TableCell align="right">
                                                <Box
                                                    sx={{
                                                        ...getStatusStyles(detail.status),
                                                        padding: "8px 16px",
                                                        borderRadius: "8px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {StatusName}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginRight: "10px" }}
                                                >
                                                    Hủy
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: "10px" }}
                                        >
                                            Tạo yêu cầu
                                        </Button>
                                    </div>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const WarrantyManagement: React.FC = () => {
    const [requests, setRequests] = useState<WarrantyProps[]>([]);

    const { apiGetWarranty } = ApiWarranty();

    const fetchWarranty = async () => {
        const response = await apiGetWarranty();
        setRequests(response.data);
    };

    useEffect(() => {
        fetchWarranty();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right">Số serial</TableCell>
                        <TableCell align="right">Tên sản phẩm</TableCell>
                        <TableCell align="right">Trạng thái</TableCell>
                        <TableCell align="right">Ngày tạo phiếu</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((row: WarrantyProps) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WarrantyManagement;
