//mui
import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
//models
import { GetMachineComponents } from "../../models/machineComponent";
//api
import { MachineryComponentApi } from "../../api/services/apiMachineComponent";
//components
import { toast } from "react-toastify";
import { Button } from "antd";
import config from "../../configs";
import ModalComponentDetail from "./Popup/ModalUpdateComponentDetail";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const ProductComponentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [component, setComponent] = useState<GetMachineComponents>();
  const [open, setOpen] = useState<boolean>(false);

  const { apiGetMachineryComponentDetail, loading } = MachineryComponentApi();

  const fetchProductDetail = async () => {
    try {
      if (id) {
        const response = await apiGetMachineryComponentDetail(id);

        if (response && response.status === 200) {
          setComponent(response.data);
        } else toast.error(response.Error);
      }
    } catch (error) {
      throw new Error("Get Detail Failed");
    }
  };

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleOpenSerial = () => {
    if (id) {
      navigate(
        config.adminRoutes.viewDetailMachineComponentSerial.replace(":id", id)
      );
    }
  };
  const handleUpdateSuccess = (response: string) => {
    handleClose();
    fetchProductDetail();
    toast.success(response);
  };
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Stack spacing={2} display="flex" direction="row">
              <Button onClick={() => handleOpenSerial()}>
                Cập nhật số lượng bộ phận
              </Button>
              <Button onClick={() => handleClickOpen()}>
                Cập nhật thông tin bộ phận
              </Button>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    name="name"
                    label="Tên sản phẩm"
                    value={component?.name || ""}
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
                      value={component?.description || ""}
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
                    name="quantity"
                    label="Số máy khả dụng"
                    placeholder="0"
                    value={component?.quantity?.Available || 0}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: "number",
                      inputProps: { min: 0 },
                      readOnly: true,
                    }}
                  />
                </Stack>
                <Stack spacing={3} mb={2}>
                  <TextField
                    name="sellingPrice"
                    label="Giá bán"
                    placeholder="0.00"
                    value={component?.sellingPrice || 0}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VNĐ</InputAdornment>
                      ),
                      type: "number",
                      inputProps: { min: 0 },
                      readOnly: true,
                    }}
                  />
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mt={2}>
                    <TextField
                      name="brand"
                      label="Thương hiệu"
                      value={component?.brand?.name || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="origin"
                      label="Xuất xứ"
                      value={component?.origin?.name || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="categoryId"
                      label="loại máy"
                      value={component?.category.name || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="timeWarranty"
                      label="Thời gian bảo trì"
                      placeholder="0"
                      value={component?.timeWarranty || 0}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Năm</InputAdornment>
                        ),
                        type: "number",
                        readOnly: true,
                      }}
                    />
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
          {open && (
            <ModalComponentDetail
              productData={component}
              onUpdateSuccess={handleUpdateSuccess}
              handleClose={handleClose}
              open={open}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductComponentDetail;
