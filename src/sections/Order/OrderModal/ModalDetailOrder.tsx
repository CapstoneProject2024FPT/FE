import React, { useEffect, useState } from "react";
import { Modal } from "antd";

//component
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OrderProps, statusMapping } from "../../../models/order";
import { formatAddress, formatMoney } from "../../../utils/fn";
import { RoleType, userProps } from "../../../models/UserData";
import { CustomerApi } from "../../../api/services/apiUser";
import { toast } from "react-toastify";
import { ApiTask } from "../../../api/services/apiTask";
import { GetTaskProps } from "../../../models/task";

interface ModalBrand {
  OrderData: OrderProps | null;
  open: boolean;
  handleClose: () => void;
}

const ModalDetailOrder: React.FC<ModalBrand> = ({
  OrderData,
  open,
  handleClose,
}) => {
  const [customer, setCustomer] = useState<userProps>();
  const [staff, setStaff] = useState<GetTaskProps[]>([]);

  const { apiUserProfile } = CustomerApi();
  const { apiGetTaskStaff } = ApiTask();
  const fetchCustomerData = async () => {
    try {
      if (OrderData) {
        const response = await apiUserProfile(OrderData.userInfo.id);
        if (response.status === 200) {
          setCustomer(response.data);
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("Lỗi lấy thông tin người dung");
    }
  };

  const fetchStaffData = async () => {
    try {
      if (OrderData) {
        const params = {
          OrderId: OrderData.orderId,
        };
        const response = await apiGetTaskStaff(params);
        if (response.status === 200) {
          setStaff(response.data);
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("Lỗi lấy thông tin người dung");
    }
  };
  useEffect(() => {
    fetchCustomerData();
    fetchStaffData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        return { backgroundColor: "#FFD700", color: "white" }; // vàng
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
              {OrderData?.productList.map((product) => (
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
                <TableCell sx={{ width: "30%" }}>Người nhận</TableCell>
                <TableCell>{customer?.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Số điện thoại</TableCell>
                <TableCell>{customer?.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ghi chú đơn hàng</TableCell>
                <TableCell>{OrderData?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>{formatAddress(OrderData?.address)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Ghi chú </TableCell>
                <TableCell>{OrderData?.note}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {staff.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom component="div">
                Nhân viên giao hàng
              </Typography>
              <Table size="small" aria-label="additional-info">
                <TableBody>
                  {staff?.map((detail) => (
                    <React.Fragment key={detail.id}>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>
                          Tên nhân viên
                        </TableCell>
                        <TableCell>{detail.staff.fullName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>Ghi chú </TableCell>
                        <TableCell>
                          {detail.staff.role === RoleType.TECHNICAL
                            ? "Nhân viên kĩ thuật"
                            : ""}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Box>
      ) : (
        <Card>
          <Typography>Không có dữ liệu chi tiết của đơn hàng</Typography>
        </Card>
      )}
    </Modal>
  );
};

export default ModalDetailOrder;
