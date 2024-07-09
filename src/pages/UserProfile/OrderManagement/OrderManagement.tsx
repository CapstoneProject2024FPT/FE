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
  IconButton,
  TablePagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ApiOrder } from "../../../api/services/apiOrder";
import { OrderProps } from "../../../models/order";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";

const statusMapping: { [key: string]: string } = {
  Pending: "Đang chờ xử lý",
  Completed: "Hoàn thành",
  Canceled: "Đã hủy",
  // Add more status mappings as needed
};

const Row = (props: { row: OrderProps }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const formatStatus = (status: string) => {
    return statusMapping[status] || status;
  };

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
        <TableCell>{formatDateFunc.formatDate(row.createDate)}</TableCell>
        <TableCell>{formatDateFunc.formatDate(row.completedDate)}</TableCell>
        <TableCell>{formatMoney(row.finalAmount)}</TableCell>
        <TableCell>{formatStatus(row.status)}</TableCell>
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
                      <TableCell>{formatMoney(product.totalAmount)}</TableCell>
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
                    <TableCell>{formatAddress(row?.address)}</TableCell>
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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const routePage = [15, 20, 25, 30];

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loginInfo = localStorage.getItem("loginInfo") || "";
  const auth = JSON.parse(loginInfo);

  //api
  const { apiGetOrderById } = ApiOrder();

  const fetchOrders = async () => {
    try {
      if (auth) {
        const params = {
          AccountId: auth.data.id,
        };
        const apiResponse = await apiGetOrderById(params);
        const orderList = apiResponse.data;
        setOrders(orderList.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Đơn hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
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
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <Row key={order.orderId} row={order} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={routePage}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </TableContainer>
    </Container>
  );
};

export default OrderManagement;
