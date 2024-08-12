/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import {
  statusMappingTransaction,
  TransactionProps,
} from "../../../../models/transaction";
import { formatDateFunc, formatMoney } from "../../../../utils/fn";

// _mock

// ----------------------------------------------------------------------

type Props = {
  transactionData: TransactionProps | undefined;
  recordOrderData: Record<string, string>;
  open: boolean;
  onClose: VoidFunction;
};

export default function ModalTransactionDetail({
  transactionData,
  recordOrderData,
  open,
  onClose,
}: Props) {
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

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết giao dịch</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  value={transactionData?.invoiceId}
                  label="Mã giao dịch"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  value={formatDateFunc.formatDateTime(
                    transactionData?.createdAt
                  )}
                  label="Ngày tạo giao dịch"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  value={formatMoney(transactionData?.totalAmount)}
                  label="Số tiền giao dịch"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  value={
                    recordOrderData[
                      transactionData ? transactionData.orderId : ""
                    ]
                  }
                  label="Mã đơn hàng"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  value={transactionData?.payType}
                  label="Loại thanh toán"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Box>
                  <Box
                    sx={{
                      ...getStatusStyles(transactionData?.status ?? ""),
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {handleStatusName(transactionData?.status ?? "")}
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
