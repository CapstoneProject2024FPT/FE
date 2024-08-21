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
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import { userProps } from "../../../models/UserData";
import { CustomerApi } from "../../../api/services/apiUser";
import { toast } from "react-toastify";
import { GetTaskProps, StatusTaskType } from "../../../models/task";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyPropsById } from "../../../models/warranty";
import config from "../../../configs";

interface Modal {
  TaskData: GetTaskProps | null;
  open: boolean;
  handleClose: () => void;
}

const ModalDetailTask: React.FC<Modal> = ({ TaskData, open, handleClose }) => {
  const [customer, setCustomer] = useState<userProps>();
  const [warranty, setWarranty] = useState<WarrantyPropsById>();

  const { apiUserProfile } = CustomerApi();
  const { apiGetWarrantyById } = ApiWarranty();
  const fetchCustomerData = async () => {
    try {
      if (TaskData) {
        const response = await apiUserProfile(TaskData.address.account.id);
        if (response.status === 200) {
          setCustomer(response.data);
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.GetUserError);
    }
  };

  const fetchWarantyId = async (id: string) => {
    try {
      if (TaskData) {
        const response = await apiGetWarrantyById(id);
        if (response.status === 200) {
          setWarranty(response.data);
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

  useEffect(() => {
    if (TaskData?.warrantyDetail?.warrantyId) {
      fetchWarantyId(TaskData.warrantyDetail.warrantyId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={`Chi Tiết Nhiệm Vụ ${TaskData?.id ?? ""}`}
      open={open}
      onCancel={handleClose}
      footer={[]}
      style={{ top: 50 }}
      width={600}
    >
      {TaskData ? (
        <Box margin={1}>
          <Typography variant="h6" gutterBottom component="div">
            Chi tiết nhiệm vụ
          </Typography>
          <Table size="small" aria-label="products">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Loại nhiệm vụ</TableCell>
                <TableCell>
                  {TaskData?.type === "Delivery" ? "Giao Hàng" : "Bảo Hành"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Ngày giao</TableCell>
                <TableCell>
                  {formatDateFunc.formatDate(TaskData?.createDate)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Ngày thực hiện</TableCell>
                <TableCell>
                  {TaskData?.excutionDate
                    ? formatDateFunc.formatDate(TaskData?.excutionDate)
                    : "------"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Ngày hoàn thành</TableCell>
                <TableCell>
                  {TaskData?.completedDate
                    ? formatDateFunc.formatDate(TaskData?.completedDate)
                    : "------"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: "30%" }}>Tình trạng</TableCell>
                <TableCell>
                  {TaskData?.status === StatusTaskType.PROCESS
                    ? "Đang tiến hành"
                    : "Hoàn Thành"}
                </TableCell>
              </TableRow>
              {TaskData?.type === "Delivery" ? (
                <>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Mã đơn hàng</TableCell>
                    <TableCell>{TaskData?.order.invoiceCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Giá tiền</TableCell>
                    <TableCell>
                      {formatMoney(TaskData?.order?.finalAmount)}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Mã máy</TableCell>
                    <TableCell>{warranty?.inventory.serialNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Tên máy</TableCell>
                    <TableCell>
                      {warranty?.inventory?.machinery?.name}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableHead>
            <TableBody>
              <TableRow></TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" gutterBottom component="div">
            Thông Tin Người Nhận
          </Typography>
          <Table size="small" aria-label="additional-info">
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Tên khách hàng</TableCell>
                <TableCell>{customer?.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Số điện thoại</TableCell>
                <TableCell>{customer?.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>{formatAddress(TaskData?.address)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" gutterBottom component="div">
            Thông Tin Nhân Viên
          </Typography>
          <Table size="small" aria-label="additional-info">
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Tên nhân viên</TableCell>
                <TableCell>{TaskData?.staff.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Chức vụ</TableCell>
                <TableCell>
                  {TaskData?.staff.role === "Technical"
                    ? "Nhân viên kĩ thuật"
                    : ""}
                </TableCell>
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

export default ModalDetailTask;
