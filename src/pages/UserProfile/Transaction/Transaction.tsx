import React, { useEffect, useState } from "react";
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
  TablePagination,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ApiTransaction } from "../../../api/services/apiTransaction";
import {
  statusMappingTransaction,
  TransactionProps,
} from "../../../models/transaction";
import EmptyOrder from "../../../components/EmptyOrder";
import { formatDateFunc, formatMoney } from "../../../utils/fn";
import { ApiOrder } from "../../../api/services/apiOrder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModalTransactionDetail from "./popup/ModalTransactionDetail";

const Transaction: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [userTransaction, setUserTransaction] = useState<TransactionProps[]>(
    []
  );
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [invoiceCodes, setInvoiceCodes] = useState<Record<string, string>>({});
  const [selectData, setSelectData] = useState<TransactionProps>();

  //paginate
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const routePage = [10, 15, 20];

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;

  //status color
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return { backgroundColor: "#FFD700", color: "black" }; // vàng
      case "SUCCESS":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "FAILED":
        return { backgroundColor: "#F44336", color: "white" }; // đỏ
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const handleStatusName = (text: string) => {
    const defaultStatus = "";
    const statusName = text
      ? statusMappingTransaction.find((status) => status.id === text)?.name
      : defaultStatus;

    return statusName;
  };
  //open
  const handleOpen = (transaction: TransactionProps) => {
    setSelectData(transaction);
    setOpen(!open);
    handleCloseMenu();
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  //api
  const { apiUserTransaction } = ApiTransaction();
  const { apiOrderId } = ApiOrder();
  const fetchUserTransaction = async () => {
    const id: string = auth?.data.id;
    try {
      if (id) {
        const params = {
          AccountId: id,
        };
        const response = await apiUserTransaction(params);

        setUserTransaction(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderDetail = async (id: string[]) => {
    const orderResponse = await Promise.all(
      id.map(async (item) => {
        const response = await apiOrderId(item);
        return { id: item, name: response.data.invoiceCode };
      })
    );

    const orderByTransaction = orderResponse.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {} as Record<string, string>);
    setInvoiceCodes(orderByTransaction);
  };
  useEffect(() => {
    fetchUserTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userTransaction) {
      const orders = userTransaction.map((item) => item.orderId);
      setOrderIds(orders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTransaction]);

  useEffect(() => {
    if (orderIds) {
      fetchOrderDetail(orderIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIds]);
  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch sử giao dịch
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Mã giao dịch</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Mã Đơn hàng</TableCell>
                <TableCell>Số tiền giao dịch</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Phương thức giao dịch</TableCell>
                <TableCell>Loại đơn thanh toán</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(userTransaction ?? []).length > 0 ? (
                userTransaction
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction, idx) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{transaction.invoiceId}</TableCell>
                      <TableCell>
                        {formatDateFunc.formatDateTime(transaction.createdAt)}
                      </TableCell>
                      <TableCell>{invoiceCodes[transaction.orderId]}</TableCell>
                      <TableCell>
                        {formatMoney(transaction.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            ...getStatusStyles(transaction.status),
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "inline-block",
                          }}
                        >
                          {handleStatusName(transaction.status)}
                        </Box>
                      </TableCell>
                      {transaction.payType?.split("_").map((part, index) => (
                        <TableCell key={index}>
                          {part === "Order"
                            ? "Mua hàng"
                            : part === "Warranty"
                            ? "Bảo hành"
                            : part.toUpperCase()}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          aria-label="more actions"
                          size="small"
                          onClick={handleOpenMenu}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleOpen(transaction)}>
                            Chi tiết giao dịch
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <EmptyOrder title="Hiện tại chưa có giao dịch nào" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={userTransaction.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={routePage}
        />
      </Container>
      {open && (
        <ModalTransactionDetail
          onClose={handleClose}
          recordOrderData={invoiceCodes}
          open={open}
          transactionData={selectData}
        />
      )}
    </>
  );
};

export default Transaction;
