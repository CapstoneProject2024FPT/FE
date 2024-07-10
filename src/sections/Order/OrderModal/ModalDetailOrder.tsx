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
import { OrderProps } from "../../../models/order";
import { formatAddress, formatMoney } from "../../../utils/fn";
import { userProps } from "../../../models/UserData";
import { CustomerApi } from "../../../api/services/apiUser";
import { toast } from "react-toastify";

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

  const { apiUserProfile } = CustomerApi();
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

  useEffect(() => {
    fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                <TableCell>Ghi chú</TableCell>
                <TableCell>{OrderData?.note}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>{formatAddress(OrderData?.address)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
