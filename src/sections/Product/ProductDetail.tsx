//mui
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//models

//api
import { MachineryApi } from "../../api/services/apiMachinery";
import { useParams } from "react-router-dom";

//components
import { useEffect, useState } from "react";
import { ProductDetailProps } from "../../models/products";
import { toast } from "react-toastify";
import Fancybox from "../../components/fancy-box-slide/FancyBox";
import ModalProductDetailPopup from "./PopupProduct/ModalUpdateProductDetail";
import { Button } from "antd";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [machine, setMachine] = useState<ProductDetailProps>();
  const [open, setOpen] = useState<boolean>(false);

  const { apiGetDetailMachine, loading } = MachineryApi();

  const fetchProductDetail = async () => {
    try {
      if (id) {
        const response = await apiGetDetailMachine(id);

        if (response && response.status === 200) {
          setMachine(response.data);
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
              <Button onClick={() => handleClickOpen()}>
                Cập nhật thông tin máy
              </Button>
              <Button onClick={() => handleClickOpen()}>
                Cập nhật thông số kĩ thuật của máy
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
                    value={machine?.name || ""}
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
                      value={machine?.description || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  <div>
                    <LabelStyle>Hình ảnh</LabelStyle>
                    <Fancybox
                      options={{
                        Carousel: {
                          infinite: false,
                        },
                      }}
                    >
                      {machine?.image.map((imageList, index) => (
                        <a
                          data-fancybox="gallery"
                          href={imageList.imageURL}
                          key={index}
                          style={{ marginRight: "5px" }}
                        >
                          <img
                            alt=""
                            src={imageList.imageURL}
                            width="150"
                            height="100"
                          />
                        </a>
                      ))}
                    </Fancybox>
                  </div>

                  <div>
                    <LabelStyle>Thông số kỹ thuật</LabelStyle>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              Tên Thông số
                            </TableCell>
                            <TableCell align="right">giá trị</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {machine?.specifications?.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                }}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
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
                      value={machine?.brand || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="origin"
                      label="Xuất xứ"
                      value={machine?.origin || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="model"
                      label="Mẫu sản phẩm"
                      value={machine?.model || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="categoryId"
                      label="loại máy"
                      value={machine?.category.name || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      name="timeWarranty"
                      label="Thời gian bảo trì"
                      placeholder="0"
                      value={machine?.timeWarranty || 0}
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

                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mb={2}>
                    <TextField
                      name="sellingPrice"
                      label="Giá bán"
                      placeholder="0.00"
                      value={machine?.sellingPrice || 0}
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
              </Stack>
            </Grid>
          </Grid>
          {open && (
            <ModalProductDetailPopup
              productData={machine}
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

export default ProductDetail;
