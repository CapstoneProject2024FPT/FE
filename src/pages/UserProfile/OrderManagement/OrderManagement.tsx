import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Collapse,
  IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ApiOrder } from "../../../api/services/apiOrder";
import { OrderProps } from "../../../models/order";


const Row = (props: { row: OrderProps }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const formatTotalAmount = (totalAmount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(totalAmount);
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{row.invoiceCode}</TableCell>
        <TableCell>{new Date(row.createDate).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.completedDate).toLocaleDateString()}</TableCell>
        <TableCell>{formatTotalAmount(row.finalAmount)}</TableCell>
        <TableCell>{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết sản phẩm
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Giá sản phẩm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.productList.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{formatTotalAmount(product.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography variant="h6" gutterBottom component="div">
                Thông tin bổ sung
              </Typography>
              <Table size="small" aria-label="additional-info">
                <TableBody>
                  <TableRow>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell>{row.note}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>{row.address}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);

  //api
  const { apiGetOrder } = ApiOrder();

  //----------------------------------------------------------------------------
  const fetchOrders = async () => {
    try {
      const apiResponse = await apiGetOrder();
      const orderList = apiResponse.data;
      setOrders(orderList.items);
      console.log(orderList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      fetchOrders();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Đơn hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày hoàn thành</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row key={order.orderId} row={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderManagement;
