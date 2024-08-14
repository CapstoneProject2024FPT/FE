/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
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
  Menu,
  MenuItem,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ApiOrder } from "../../../api/services/apiOrder";
import {
  GetOrderProps,
  OrderProps,
  statusMapping,
  StatusType,
} from "../../../models/order";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import { toast } from "react-toastify";
import EmptyOrder from "../../../components/EmptyOrder";
import CancelOrderDialog from "./Modal/PopupCancelOrder";
import ExportPDF from "./Exportpdf/ExportPDF";
import WarrantyPDF from "./Exportpdf/WarrantyPDF";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../../../configs";
import moment from "moment";
import { ApiCheckout } from "../../../api/services/apiCheckout";
import { handleSendEmail } from "../../../utils/sendEmail";
import useDebounce from "../../../hooks/useDebounce";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "UnPaid":
      return { backgroundColor: "#FFD700", color: "black" }; // vàng
    case "Paid":
      return { backgroundColor: "#2196F3", color: "white" }; // xanh dương
    case "Completed":
      return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
    case "Canceled":
      return { backgroundColor: "#F44336", color: "white" }; // đỏ
    case "Delivery":
      return { backgroundColor: "#f39c12", color: "black" }; // cam
    case "ReDelivery":
      return { backgroundColor: "#704c5e", color: "white" }; // Tím
    default:
      return { backgroundColor: "transparent", color: "black" };
  }
};

const Row = (props: {
  row: OrderProps;
  onCancelOrder: (orderId: string, note: string, invoiceCode?: string) => void;
}) => {
  const { row, onCancelOrder } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  let email: string = "";
  let username: string = "";
  let isSucess: boolean = false;
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const { apiPaymentUpdate } = ApiCheckout();
  const location = useLocation();
  const navigate = useNavigate();
  const defaultStatus = "Đang chờ xác nhận";
  const StatusName = row?.status
    ? statusMapping?.find((status) => status.id === row?.status)?.name
    : defaultStatus;

  const handleCancelOrder = () => {
    onCancelOrder(row.orderId, row.invoiceCode);
    handleCloseMenu();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  //popup detail
  const handleDetailOrder = (record: OrderProps) => {
    navigate(config.routes.orderManagementId.replace(":id", record.orderId));
  };

  useEffect(() => {
    if (row.status === StatusType.UNPAID) {
      const createTime = moment(row.createDate);
      const now = moment();
      const diff = moment.duration(now.diff(createTime));
      const initialRemainingTime = 30 * 60 - diff.asSeconds(); // 30 minutes in seconds

      if (initialRemainingTime > 0) {
        setRemainingTime(initialRemainingTime);
      }

      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer);
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [row]);

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  //vnreturn
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get("vnp_TransactionStatus");

    const handleTransactionStatus = async () => {
      const id = sessionStorage.getItem("paymmentID");
      if (transactionId === "00" && id) {
        const params = { status: "SUCCESS" };
        try {
          const response = await apiPaymentUpdate(params, id);
          if (response.status === 200) {
            toast.success("Thanh toán thành công");
            // send mail for payment success
            const getUserInfoString = localStorage.getItem("getUserInfo");
            if (getUserInfoString) {
              const userInfo = JSON.parse(getUserInfoString);
              email = userInfo?.email;
              username = userInfo?.username;
            } else {
              console.error("No user info found in localStorage");
            }
            isSucess = true;
            handleSendEmail(isSucess, email, username);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      } else if (id) {
        const params = { status: "FAILED" };
        try {
          const response = await apiPaymentUpdate(params, id);
          if (response.status === 200) {
            toast.error("Thanh toán thất bại");
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      }
      sessionStorage.removeItem("paymmentID");
      isSucess = false;
    };

    if (transactionId) {
      handleTransactionStatus();
    }
  }, [location, navigate]);

  const handlePayment = async (row: OrderProps) => {
    navigate(config.routes.paymentOrderID.replace(":id", row.orderId));
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
        <TableCell>{row.type === "Order" ? "Mua hàng" : " Bảo hành"}</TableCell>
        <TableCell>{formatDateFunc.formatDate(row.createDate)}</TableCell>
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
        {row.status === StatusType.UNPAID && (
          <TableCell>
            <Button variant="outlined" onClick={() => handlePayment(row)}>
              Thanh Toán
            </Button>
          </TableCell>
        )}
        <TableCell>
          <IconButton
            aria-label="more actions"
            size="small"
            onClick={handleOpenMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            {row.status === StatusType.UNPAID && (
              <MenuItem onClick={handleCancelOrder}>Hủy đơn hàng</MenuItem>
            )}
            <MenuItem onClick={() => handleDetailOrder(row)}>
              Chi tiết đơn hàng
            </MenuItem>
            {(row.status === StatusType.COMPLETED ||
              row.status === StatusType.PAID) && (
              <MenuItem>
                <ExportPDF row={row} />
              </MenuItem>
            )}
          </Menu>
        </TableCell>
        <TableCell style={{ width: "100px" }}>
          {row.status === StatusType.UNPAID &&
            remainingTime !== null &&
            row.type === "Order" && (
              <Box
                sx={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  display: "inline-block",
                  backgroundColor: "#FFD700",
                  color: "black",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {formatRemainingTime(remainingTime)}
              </Box>
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
                    {row.type === "Order" && <TableCell>Hành động</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.type === "Order" ? (
                    <>
                      {row.productList.map((product) => (
                        <TableRow key={product.orderDetailId}>
                          <TableCell>
                            <Link
                              to={config.routes.productDetail.replace(
                                ":id",
                                product.productId
                              )}
                              style={{ textDecoration: "none", color: "black" }}
                            >
                              {product.productName}
                            </Link>
                          </TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {formatMoney(product.totalAmount)}
                          </TableCell>

                          <TableCell>
                            <WarrantyPDF order={row} product={product} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <>
                      {row.productList.map((product) => (
                        <TableRow key={product.orderDetailId}>
                          <TableCell>{product.machineComponentName}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {formatMoney(product.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>

              <Typography variant="h6" gutterBottom component="div">
                Thông tin bổ sung
              </Typography>
              <Table size="small" aria-label="additional-info">
                <TableBody>
                  <TableRow>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell>{row.description}</TableCell>
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
  const [orders, setOrders] = useState<GetOrderProps>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceCode, setSelectedInvoiceCode] = useState<string | null>(
    null
  );
  const routePage = [15, 20, 25, 30];

  const [query, setQuery] = useState<string>("");

  const debouceQuery = useDebounce({ delay: 500, value: query });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (routePage.includes(newRowsPerPage)) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };

  const loginInfo = localStorage.getItem("loginInfo") || "";
  const auth = JSON.parse(loginInfo);

  const { apiGetOrderById, apiCancelOrder } = ApiOrder();

  const fetchOrders = useCallback(async () => {
    try {
      if (auth) {
        const params = {
          AccountId: auth.data.id,
          page: page + 1,
          size: rowsPerPage,
          InvoiceCode: debouceQuery,
        };
        const apiResponse = await apiGetOrderById(params);
        const orderList = apiResponse.data;
        setOrders(orderList);
        handleAutoCancel(orderList.items);
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiGetOrderById]);

  const handleOpenDialog = (orderId: string, invoiceCode: string) => {
    setSelectedOrderId(orderId);
    setSelectedInvoiceCode(invoiceCode); // New state for invoiceCode
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
    setSelectedInvoiceCode(null);
  };

  const handleConfirmCancel = async (note: string) => {
    if (selectedOrderId && selectedInvoiceCode) {
      try {
        await apiCancelOrder({
          orderId: selectedOrderId,
          status: "Canceled",
          note,
        });
        fetchOrders();
        toast.success(config.MessageNotice.CancelOrderSuccess);
      } catch (error) {
        toast.error(config.MessageNotice.CancelOrderFailed);
        console.log(error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handAutoSendMail = (invoiceCode: string) => {
    let email: string = "";
    let username: string = "";
    console.log(invoiceCode);
    const getUserInfoString = localStorage.getItem("getUserInfo");
    if (getUserInfoString) {
      const userInfo = JSON.parse(getUserInfoString);
      email = userInfo?.email;
      username = userInfo?.username;
    } else {
      console.error("No user info found in localStorage");
      return;
    }
    handleSendEmail(undefined, email, username, invoiceCode);
  };

  const handleAutoCancel = (orders: OrderProps[]) => {
    orders.forEach((order) => {
      if (order.status === "UnPaid" && order.type === "Order") {
        const createTime = moment(order.createDate);
        const now = moment();
        const diff = moment.duration(now.diff(createTime));
        const minutes = diff.asMinutes();
        const minuteToCancelOrder = 30; // 30 minutes
        if (minutes >= minuteToCancelOrder) {
          apiCancelOrder({
            orderId: order.orderId,
            status: "Canceled",
            note: config.MessageNotice.ReasonCancel,
          })
            .then(() => {
              toast.success(
                config.MessageNotice.CancelOrderSuccess2.replace(
                  "invoiceCode",
                  order.invoiceCode
                )
              );
              handAutoSendMail(order.invoiceCode);
              fetchOrders();
            })
            .catch((error) => {
              toast.error(config.MessageNotice.CancelOrderFailed);
              console.log(error);
            });
        }
      }
    });
  };
  ///search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, debouceQuery]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Lịch sử mua hàng
      </Typography>
      <Stack display="flex" direction="row">
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          sx={{ width: "300px" }}
          margin="normal"
          placeholder="Nhập mã đơn hàng "
          InputLabelProps={{
            shrink: true,
          }}
        />
        {debouceQuery && (
          <Typography sx={{ mt: 5, ml: 2 }}>
            Có {orders?.items?.length} kết quả phù hợp
          </Typography>
        )}
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Loại đơn hàng</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(orders?.items ?? []).length > 0 ? (
              orders?.items.map((order) => (
                <Row
                  key={order.orderId}
                  row={order}
                  onCancelOrder={handleOpenDialog}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyOrder title="Hiện tại chưa có đơn hàng" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={routePage}
        component="div"
        count={orders?.total ? orders.total : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang"
      />
      <CancelOrderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        invoiceCode={selectedInvoiceCode}
      />
    </Container>
  );
};

export default OrderManagement;
