import React from "react";
import { Modal } from "antd";

//component
import {
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { OrderProps, statusMapping } from "../../../../models/order";
import { formatDateFunc } from "../../../../utils/fn";

interface ModalBrand {
  OrderData: OrderProps | null | undefined;
  open: boolean;
  handleClose: () => void;
}

const PopupDetailOrder: React.FC<ModalBrand> = ({
  OrderData,
  open,
  handleClose,
}) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "UnPaid":
        return { backgroundColor: "#FFD700", color: "black" }; // vàng
      case "Paid":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "Completed":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "Canceled":
        return { backgroundColor: "#F44336", color: "white" }; // đỏ
      case "Delivery":
        return { backgroundColor: "#f39c12", color: "white" }; // vàng
      case "ReDelivery":
        return { backgroundColor: "#704c5e", color: "white" };
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const defaultStatus = "Đang chờ xác nhận";
  const StatusName = OrderData?.status
    ? statusMapping?.find((status) => status.id === OrderData?.status)?.name
    : defaultStatus;

  return (
    <Modal
      title={`Chi Tiết đơn hàng mã ${OrderData?.invoiceCode ?? ""}`}
      open={open}
      onCancel={handleClose}
      footer={[]}
      style={{ top: 50 }}
      width={600}
    >
      {OrderData ? (
        <Box>
          <Typography variant="h6" gutterBottom component="div">
            Trạng thái đơn
          </Typography>
          <Table size="small" aria-label="additional-info">
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Trạng thái</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      ...getStatusStyles(OrderData?.status),
                      padding: "8px 16px",
                      borderRadius: "8px",
                      display: "inline-block",
                    }}
                  >
                    {StatusName}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider orientation="vertical" flexItem sx={{ ml: 1 }} />
          <Typography variant="h6" gutterBottom component="div">
            Lịch sử giao hàng
          </Typography>
          {OrderData?.note?.map((detail, index) => (
            <Table size="small" key={index}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{}}>Lần giao</TableCell>
                  <TableCell sx={{}}>{index + 1}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{}}>Trạng thái</TableCell>
                  <TableCell sx={{}}>
                    {detail.status === "SUCCESS"
                      ? "Giao hàng thành công"
                      : "Giao hàng thất bại"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{}}>Ghi chú</TableCell>
                  <TableCell sx={{}}>{detail.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{}}>Ngày giao</TableCell>
                  <TableCell sx={{}}>
                    {detail?.createDate
                      ? formatDateFunc.formatDateTime(detail.createDate)
                      : ""}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ))}
        </Box>
      ) : (
        <Card>
          <Typography>Không có dữ liệu chi tiết của đơn hàng</Typography>
        </Card>
      )}
    </Modal>
  );
};

export default PopupDetailOrder;
