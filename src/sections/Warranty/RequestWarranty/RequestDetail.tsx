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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
//components
import { toast } from "react-toastify";
import { Button } from "antd";
import { WarrantyPropsById } from "../../../models/warranty";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { formatAddress, formatDateFunc } from "../../../utils/fn";
import ModalDeliveryTaskWarranty from "../Modal/ModalDeliveryTaskWarranty";
import { PlusOutlined } from "@ant-design/icons";
import { CustomerApi } from "../../../api/services/apiUser";
import { RoleType, staffProps } from "../../../models/UserData";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [requestWarranty, setRequestWarranty] = useState<WarrantyPropsById>();
  const [open, setOpen] = useState<boolean>(false);
  const [idEmployee, setIdEmployee] = useState<string>();
  const [employee, setEmployee] = useState<staffProps>();

  const { apiGetWarrantyById, loading } = ApiWarranty();
  const { apiUserProfile } = CustomerApi();

  const fetchProductDetail = async () => {
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

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (idEmployee) {
      fetchEmployee(idEmployee);
    }

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
    fetchProductDetail();
    toast.success(response);
  };

  //check request has technical employee
  useEffect(() => {
    const nullAccountDetail = requestWarranty?.warrantyDetail.find(
      (detail) => detail.accountId !== null
    );

    if (nullAccountDetail?.accountId) {
      setIdEmployee(nullAccountDetail.accountId);
    }
  }, [requestWarranty]);

  useEffect(() => {
    if (idEmployee) {
      fetchEmployee(idEmployee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEmployee]);

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
                  <Stack spacing={3}>
                    <TextField
                      name="name"
                      label="Ngày tạo"
                      value={
                        requestWarranty?.createDate
                          ? formatDateFunc.formatDateTime(
                              requestWarranty?.createDate
                            )
                          : ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <div>
                      <LabelStyle>Mô tả</LabelStyle>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="description"
                        value={requestWarranty?.description || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                  </Stack>
                </Card>
                <Card sx={{ p: 3, mt: 2 }}>
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
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
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
