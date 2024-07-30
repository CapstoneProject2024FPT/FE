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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
//components
import { toast } from "react-toastify";
import {
  WarrantyDetailGetProps,
  WarrantyPropsById,
} from "../../../../models/warranty";
import { ApiWarranty } from "../../../../api/services/apiWarranty";
import { formatAddress, formatDateFunc } from "../../../../utils/fn";
import { RoleType, staffProps } from "../../../../models/UserData";
import { CustomerApi } from "../../../../api/services/apiUser";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const DetailWarrantyPeriodic = () => {
  const { id } = useParams<{ id: string }>();
  const [requestWarranty, setRequestWarranty] =
    useState<WarrantyDetailGetProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [warrantyPeriodicId, setWarrantyPeriodicId] = useState<string>();
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
          if (response.data.staff) setIdEmployee(response.data.staff.id);
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
    fetchWarrantyDetail();
  }, []);

  useEffect(() => {
    const fetchWarrantyData = async () => {
      if (warrantyPeriodicId) {
        setLoading(true);
        try {
          const warrantyData = await fetchWarranty(warrantyPeriodicId);
          if (warrantyData) setWarrantyPeriodic(warrantyData);
        } catch (error) {
          console.error(error);
          toast.error("Lỗi lấy dữ liệu");
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchEmployeeData = async () => {
      if (idEmployee) {
        setLoading(true);
        try {
          const empData = await fetchEmployee(idEmployee);
          if (empData) setEmployee(empData);
        } catch (error) {
          console.error(error);
          toast.error("Lỗi lấy dữ liệu");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWarrantyData();
    fetchEmployeeData();
  }, [warrantyPeriodicId, idEmployee]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
                      value={warrantyPeriodic?.inventory?.machinery?.name || ""}
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
                    <TextField
                      label="Trạng thái đơn"
                      placeholder="0.00"
                      value={
                        requestWarranty?.status === "Process"
                          ? "Đang tiến hành"
                          : "Hoàn Thành" || ""
                      }
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
          {requestWarranty?.status === "Completed" && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5">Nội dung sửa</Typography>
                <Card sx={{ p: 3 }}>
                  <TextField
                    label="Lý do"
                    value={requestWarranty?.description || ""}
                    multiline
                    rows={4}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h5">Bộ phận thay</Typography>
                <Card sx={{ p: 3 }}>
                  {requestWarranty.inventoryChanges.length > 0
                    ? requestWarranty?.inventoryChanges.map((item) => (
                        <TextField
                          sx={{ mt: 1 }}
                          label="Tên bộ phận thay thế"
                          value={item?.newInventory.componentName || ""}
                          fullWidth
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      ))
                    : "Không thay thế bộ phận nào cả"}
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default DetailWarrantyPeriodic;
