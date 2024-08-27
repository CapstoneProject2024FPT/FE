/* eslint-disable react-hooks/exhaustive-deps */
//mui
import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Stack,
  Typography,
  TextField,
  CircularProgress,
  Box,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
//components
import { toast } from "react-toastify";
import { Button } from "antd";
import {
  WarrantyDetailGetProps,
  WarrantyPropsById,
} from "../../../models/warranty";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { formatAddress, formatDateFunc, formatMoney } from "../../../utils/fn";
import ModalDeliveryTaskWarranty from "../Modal/ModalDeliveryTaskWarranty";
import { PlusOutlined } from "@ant-design/icons";
import { CustomerApi } from "../../../api/services/apiUser";
import { RoleType, staffProps } from "../../../models/UserData";
import Image from "../../../components/Image";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [requestWarranty, setRequestWarranty] = useState<WarrantyPropsById>();
  const [open, setOpen] = useState<boolean>(false);
  const [idEmployee, setIdEmployee] = useState<string>();
  const [employee, setEmployee] = useState<staffProps>();
  const [warrantyDetailId, setWarrantyDetailId] = useState<string>();
  const [warrantyDetail, setWarrantyDetail] =
    useState<WarrantyDetailGetProps>();

  const { apiGetWarrantyById, loading, apiGetWarrantyDetailById } =
    ApiWarranty();
  const { apiUserProfile } = CustomerApi();

  const fetchWarranty = async () => {
    try {
      if (id) {
        const response = await apiGetWarrantyById(id);

        if (response && response.status === 200) {
          setRequestWarranty(response.data);
          setIdEmployee(response.data.warrantyDetail.accountId);
        } else toast.error(response.Error);
      }
    } catch (error) {
      throw new Error("Get Detail Failed");
    }
  };

  const fetchEmployee = async (id: string) => {
    const response = await apiUserProfile(id);
    setEmployee(response.data);
  };

  const fetchWarrantyDetail = async (id: string) => {
    const response = await apiGetWarrantyDetailById(id);
    setWarrantyDetail(response.data);
  };

  useEffect(() => {
    fetchWarranty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleUpdateSuccess = (response: string) => {
    handleClose();
    fetchWarranty();
    toast.success(response);
  };

  //check request has technical employee
  useEffect(() => {
    const nullAccountDetail = requestWarranty?.warrantyDetail.find(
      (detail) => detail.accountId !== null
    );

    if (nullAccountDetail?.accountId) {
      setWarrantyDetailId(nullAccountDetail.id);
      setIdEmployee(nullAccountDetail.accountId);
    }
  }, [requestWarranty]);

  useEffect(() => {
    if (idEmployee) {
      fetchEmployee(idEmployee);
    }
  }, [idEmployee]);

  useEffect(() => {
    if (warrantyDetailId) {
      fetchWarrantyDetail(warrantyDetailId);
    }
  }, [warrantyDetailId]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {idEmployee === undefined && (
              <Button icon={<PlusOutlined />} onClick={() => handleClickOpen()}>
                Chọn nhân viên
              </Button>
            )}
          </div>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <CardHeader title="Thông tin phiếu bảo hành" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Ngày tạo phiếu :{" "}
                        </Typography>
                        <Typography variant="subtitle2">
                          {requestWarranty?.createDate
                            ? formatDateFunc.formatDate(
                                requestWarranty?.createDate
                              )
                            : ""}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Mô tả</Typography>
                        <Typography variant="subtitle2">
                          {requestWarranty?.description || ""}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Ngày đi bảo hành :{" "}
                        </Typography>
                        <Typography variant="subtitle2">
                          {warrantyDetail?.startDate
                            ? formatDateFunc.formatDate(
                                warrantyDetail?.startDate
                              )
                            : ""}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Ngày đi bảo hành kế tiếp :{" "}
                        </Typography>
                        <Typography variant="subtitle2">
                          {warrantyDetail?.nextMaintenanceDate
                            ? formatDateFunc.formatDate(
                                warrantyDetail?.nextMaintenanceDate
                              )
                            : ""}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                <Card sx={{ p: 3, mt: 2 }}>
                  <CardHeader title="Thông tin khách hàng" />
                  <Stack spacing={3} mb={2}>
                    <TextField
                      label="Tên khách hàng"
                      placeholder="0"
                      value={requestWarranty?.customer.fullName || ""}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Địa chỉ sửa"
                      placeholder="0"
                      value={formatAddress(requestWarranty?.address) || ""}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <Stack spacing={3} mb={2}></Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <CardHeader title="Thông tin máy" />
                    <Stack spacing={3} mt={2}>
                      <TextField
                        label="tên máy"
                        value={
                          requestWarranty?.inventory?.machinery?.name || ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Mã số máy"
                        placeholder="0.00"
                        value={requestWarranty?.inventory.serialNumber || ""}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Card>
                </Stack>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Card sx={{ p: 3 }}>
                    <CardHeader title="Thông tin nhân viên" />
                    <Stack spacing={3} mt={2}>
                      <TextField
                        label="Tên nhân viên"
                        placeholder=""
                        value={employee?.fullName || "Chưa cử nhân viên"}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Vai trò"
                        placeholder=""
                        value={
                          employee?.role === RoleType.TECHNICAL
                            ? "Nhân viên kỹ thuật"
                            : ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            {(warrantyDetail?.status === "Completed" ||
              warrantyDetail?.status === "Repairing") && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Repair Description */}
                <Grid item xs={12}>
                  <Typography variant="h5">Nội dung sửa</Typography>
                  <Card sx={{ p: 3 }}>
                    <TextField
                      label="Lý do"
                      value={warrantyDetail?.description || ""}
                      multiline
                      rows={4}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Card>
                </Grid>

                {/* Replaced Components */}
                <Grid item xs={12}>
                  <Typography variant="h5">Bộ phận thay</Typography>
                  <Card sx={{ p: 3 }}>
                    {warrantyDetail.componentChange.length > 0
                      ? warrantyDetail.componentChange.map((item, idx) => (
                          <Grid container spacing={2} key={idx}>
                            <Grid item md={6} xs={12}>
                              <TextField
                                sx={{ mt: 1 }}
                                label="Tên bộ phận thay thế"
                                value={item?.component.name || ""}
                                fullWidth
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                sx={{ mt: 1 }}
                                label="Giá tiền"
                                value={
                                  item?.component.sellingPrice
                                    ? formatMoney(item?.component.sellingPrice)
                                    : ""
                                }
                                fullWidth
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                          </Grid>
                        ))
                      : "Không thay thế bộ phận nào cả"}
                  </Card>
                </Grid>
              </Grid>
            )}
            {warrantyDetail && warrantyDetail?.note?.length > 0 && (
              <Stack>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Ghi chú
                </Typography>
                <Card sx={{ p: 3 }}>
                  {warrantyDetail.note.length > 0
                    ? warrantyDetail.note.map((item, idx) => (
                        <Card key={idx} sx={{ mt: 2, p: 3, boxShadow: 2 }}>
                          <Grid container>
                            <Grid item md={4} xs={12}>
                              <Typography>Ghi chú lần {idx + 1}: </Typography>
                            </Grid>
                            <Grid item md={8} xs={12}></Grid>
                          </Grid>
                          <Grid container>
                            <Grid item md={4} xs={12}>
                              <Typography>Nội dung: </Typography>
                            </Grid>
                            <Grid item md={8} xs={12}>
                              <Typography>{item.description} </Typography>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item md={4} xs={12}>
                              <Typography>Ngày tạo</Typography>
                            </Grid>
                            <Grid item md={8} xs={12}>
                              <Typography>
                                {formatDateFunc.formatDate(item.createDate)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Image src={item.image} />
                        </Card>
                      ))
                    : "Không thay thế bộ phận nào cả"}
                </Card>
              </Stack>
            )}
          </Box>
          {open && (
            <ModalDeliveryTaskWarranty
              OrderData={requestWarranty}
              handleCLose={handleClose}
              onCreateSuccess={handleUpdateSuccess}
              openTaskPopup={open}
            />
          )}
        </>
      )}
    </>
  );
};

export default RequestDetail;
