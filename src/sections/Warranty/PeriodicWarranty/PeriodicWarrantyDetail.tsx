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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
//components
import { toast } from "react-toastify";
import { Button } from "antd";
import {
  WarrantyDetailProps,
  WarrantyPropsById,
} from "../../../models/warranty";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { formatAddress, formatDateFunc } from "../../../utils/fn";
import { PlusOutlined } from "@ant-design/icons";
import { RoleType, staffProps } from "../../../models/UserData";
import ModalDeliveryTaskPeriodic from "../Modal/ModalDeliveryTaskPeriodic";
import { CustomerApi } from "../../../api/services/apiUser";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const PeriodicWarrantyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [requestWarranty, setRequestWarranty] = useState<WarrantyDetailProps>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [warrantyPeriodicId, setWarrantyPeriodicId] = useState<string>();
  const [idWarranty, setIdWarranty] = useState<string>();
  const [warrantyPeriodic, setWarrantyPeriodic] = useState<WarrantyPropsById>();
  const [idEmployee, setIdEmployee] = useState<string>();
  const [employee, setEmployee] = useState<staffProps>();

  const { apiGetWarrantyById, apiGetWarrantyDetailById } = ApiWarranty();
  const { apiUserProfile } = CustomerApi();

  const fetchWarrantyDetail = async () => {
    try {
      if (id) {
        const response = await apiGetWarrantyDetailById(id);
        if (response && response.status === 200) {
          setRequestWarranty(response.data);
          setWarrantyPeriodicId(response.data.warrantyId);
          setIdEmployee(response.data.staff.id);
          setIdWarranty(response.data.id);
        } else toast.error(response.Error);
      }
    } catch (error) {
      throw new Error("Get Detail Failed");
    }
  };

  const fetchWarranty = async (id: string) => {
    const response = await apiGetWarrantyById(id);
    return response.data;
  };

  const fetchEmployee = async (id: string) => {
    const response = await apiUserProfile(id);
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchWarrantyDetail();

        const [warrantyData, employeeData] = await Promise.all([
          warrantyPeriodicId ? fetchWarranty(warrantyPeriodicId) : null,
          idEmployee ? fetchEmployee(idEmployee) : null,
        ]);

        if (warrantyData) setWarrantyPeriodic(warrantyData);
        if (employeeData) setEmployee(employeeData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [id, warrantyPeriodicId, idEmployee]);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleUpdateSuccess = (response: string) => {
    handleClose();
    fetchWarrantyDetail();
    toast.success(response);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {requestWarranty?.accountId !== null && (
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
                        warrantyPeriodic?.createDate
                          ? formatDateFunc.formatDateTime(
                              warrantyPeriodic?.createDate
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
                        value={warrantyPeriodic?.description || ""}
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
                      value={warrantyPeriodic?.customer.fullName || ""}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Địa chỉ sửa"
                      placeholder="0"
                      value={formatAddress(warrantyPeriodic?.address) || ""}
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
                          warrantyPeriodic?.inventory?.machinery?.name || ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Mã số máy"
                        placeholder="0.00"
                        value={warrantyPeriodic?.inventory.serialNumber || ""}
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
            <ModalDeliveryTaskPeriodic
              OrderData={warrantyPeriodic}
              idWarranty={idWarranty}
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

export default PeriodicWarrantyDetail;
