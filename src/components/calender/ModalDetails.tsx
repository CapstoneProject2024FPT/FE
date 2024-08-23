import React, { useEffect, useState } from "react";
import { Modal } from "antd";
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
import { formatAddress, formatDateFunc, formatMoney } from "../../utils/fn";
import { userProps } from "../../models/UserData";
import { CustomerApi } from "../../api/services/apiUser";
import { toast } from "react-toastify";
import { GetTaskProps, StatusTaskType } from "../../models/task";
import { ApiWarranty } from "../../api/services/apiWarranty";
import { WarrantyPropsById } from "../../models/warranty";

interface ModalTask {
  TaskData: GetTaskProps[] | null;
  open: boolean;
  handleClose: () => void;
}

const ModalDetailTaskCalender: React.FC<ModalTask> = ({
  TaskData,
  open,
  handleClose,
}) => {
  const [customers, setCustomers] = useState<userProps[]>([]);
  const [warranties, setWarranties] = useState<WarrantyPropsById[]>([]);

  const { apiUserProfile } = CustomerApi();
  const { apiGetWarrantyById } = ApiWarranty();

  useEffect(() => {
    if (TaskData) {
      const fetchCustomerData = async () => {
        try {
          //lấy thông tin khách hàng
          const customerResponses = await Promise.all(
            TaskData.map((task) => apiUserProfile(task.address.account.id))
          );
          setCustomers(customerResponses.map((response) => response.data));
        } catch (error) {
          toast.error("Lỗi lấy thông tin người dùng");
        }
      };

      fetchCustomerData();

      const fetchWarrantyData = async () => {
        try {
          //lấy thông tin warranty nếu có
          const warrantyResponses = await Promise.all(
            TaskData.map((task) =>
              task.warrantyDetail?.warrantyId
                ? apiGetWarrantyById(task.warrantyDetail.warrantyId)
                : null
            )
          );
          setWarranties(
            warrantyResponses.map((response) => response?.data ?? null)
          );
        } catch (error) {
          toast.error("Lỗi lấy thông tin bảo hành");
        }
      };

      fetchWarrantyData();
    }
  }, [TaskData]);

  return (
    <Modal
      title="Chi Tiết Nhiệm Vụ"
      open={open}
      onCancel={handleClose}
      footer={[]}
      style={{ top: 50 }}
      width={600}
    >
      {TaskData && TaskData.length > 0 ? (
        <Box margin={1}>
          {TaskData.map((task, index) => (
            <Box key={task.id} marginBottom={2}>
              <Typography variant="h6" gutterBottom component="div">
                Nhiệm Vụ {index + 1}
              </Typography>
              <Table size="small" aria-label="task-details">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Loại Nhiệm vụ</TableCell>
                    <TableCell>
                      {task.type === "Delivery" ? "Giao Hàng" : "Bảo Hành"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Ngày Giao</TableCell>
                    <TableCell>
                      {formatDateFunc.formatDate(task.createDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>
                      Ngày Hoàn Thành dự kiến
                    </TableCell>
                    <TableCell>
                      {task.completedDate
                        ? formatDateFunc.formatDate(task.completedDate)
                        : "------"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Tình trạng</TableCell>
                    <TableCell>
                      {task.status === StatusTaskType.PROCESS
                        ? "Đang tiến hành"
                        : "Hoàn Thành"}
                    </TableCell>
                  </TableRow>
                  {task.type === "Delivery" ? (
                    <>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>Mã đơn hàng</TableCell>
                        <TableCell>{task.order.invoiceCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>Giá tiền</TableCell>
                        <TableCell>
                          {formatMoney(task.order.finalAmount)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>Mã máy</TableCell>
                        <TableCell>
                          {warranties[index]?.inventory.serialNumber}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>Tên máy</TableCell>
                        <TableCell>
                          {warranties[index]?.inventory?.machinery?.name}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableHead>
                <TableBody></TableBody>
              </Table>

              <Typography variant="h6" gutterBottom component="div">
                Thông Tin Người Nhận
              </Typography>
              <Table size="small" aria-label="additional-info">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Tên Khách Hàng</TableCell>
                    <TableCell>{customers[index]?.fullName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "30%" }}>Số điện thoại</TableCell>
                    <TableCell>{customers[index]?.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>{formatAddress(task.address)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
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

export default ModalDetailTaskCalender;
