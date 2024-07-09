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
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ApiOrder } from "../../../api/services/apiOrder";
import { OrderProps, statusMapping, StatusType } from "../../../models/order";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import { toast } from "react-toastify";



const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending":
      return { backgroundColor: "yellow", color: "black" };
    case "Completed":
      return { backgroundColor: "green", color: "white" };
    case "Canceled":
      return { backgroundColor: "red", color: "white" };
    default:
      return { backgroundColor: "transparent", color: "black" };
  }
};

const Row = (props: { row: OrderProps, onCancelOrder: (orderId: string, status: string, note: string) => void }) => {
  const { row, onCancelOrder } = props;
  const [open, setOpen] = useState(false);


  const defaultStatus = "Đang chờ xác nhận";

  const StatusName = row?.status
    ? statusMapping?.find((status) => status.id === row?.status)?.name
    : defaultStatus;


  const handleCancelOrder = () => {
    onCancelOrder(row.orderId, "Canceled", "Chú thích");
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
        <TableCell>
          {row.completedDate ? formatDateFunc.formatDate(row.completedDate) : "Chưa hoàn thành"}
        </TableCell>
        <TableCell>{formatMoney(row.finalAmount)}</TableCell>
        <TableCell>
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
        <TableCell>
          {row.status === StatusType.PENDING && (
            <Button variant="contained" color="secondary" onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          )}
        </TableCell>
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
                    <TableRow key={product.orderDetailId}>
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
  const { apiGetOrderById, apiCancelOrder } = ApiOrder();

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

  const cancelOrder = async (orderId: string, status: string, note: string) => {
    try {
      await apiCancelOrder({ orderId, status, note });
      fetchOrders(); // Fetch orders again to refresh the list
      toast.success("Đơn hàng đã được hủy thành công");  // Thông báo thành công
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");  // Thông báo lỗi
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
        Quản lý đơn hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày hoàn thành</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <Row key={order.orderId} row={order} onCancelOrder={cancelOrder} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={routePage}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default OrderManagement;
