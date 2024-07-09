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
import axios from "axios";
import { Button } from "@mui/material";

function createData(
    id: number,
    productName: string,
    createDate: string,
    productModel: string,
    serialNumber: string,
    status: string,
    issue: string,
    serviceRequested: string
) {
    return { id, productName, createDate, productModel, serialNumber, status, issue, serviceRequested };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const date = new Date(row.createDate);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell align="right">{row.productName}</TableCell>
                <TableCell align="right">{row.productModel}</TableCell>
                <TableCell align="right">{row.serialNumber}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.issue}</TableCell>
                <TableCell align="right">{row.serviceRequested}</TableCell>

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
                                        <TableCell>Số Serial</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.serialNumber}
                                        </TableCell>
                                        <TableCell>{row.productName}</TableCell>
                                        <TableCell>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</TableCell>
                                    </TableRow>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: "10px" }}
                                        >
                                            Hủy yêu cầu
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

const WarrantyRequests: React.FC = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios
            .get("https://6687c05c0bc7155dc018f48e.mockapi.io/request-warranty")
            .then((response) => {
                setRequests(response.data);
            });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right">Tên sản phẩm</TableCell>
                        <TableCell align="right">Model</TableCell>
                        <TableCell align="right">Số serial</TableCell>
                        <TableCell align="right">Trạng thái</TableCell>
                        <TableCell align="right">Vấn đề</TableCell>
                        <TableCell align="right">Dịch vụ yêu cầu</TableCell>
                        <TableCell align="right">Ngày tạo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((row: any) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WarrantyRequests;
