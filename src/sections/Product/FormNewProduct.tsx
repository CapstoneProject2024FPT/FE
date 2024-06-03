import { useSnackbar } from "notistack";
import { useState } from "react";
import { Formik, FieldArray, getIn } from "formik";
import {
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CreateProductFormSchema } from "../../models/products";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Modal, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { UploadRequestOption } from "rc-upload/lib/interface";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import { number, object, string, array } from "yup";

const CATEGORY_OPTION = [
  { id: 1, category: "Máy khoan" },
  { id: 2, category: "Máy Xung Điện" },
  { id: 3, category: "Máy " },
  { id: 4, category: "Máy khoan" },
  { id: 5, category: "Máy khoan" },
  { id: 6, category: "Máy khoan" },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

interface ImageList {
  url: string;
  uid: string;
}

interface imageList {
  url: string;
  uid: string;
}

export default function ProductNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const minTimeWarranty = 1;
  const maxTimeWarranty = 2;

  const [imagesUrl, setImagesUrl] = useState<ImageList[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  interface specification {
    nameSpecification: string;
    valueOfEach: string;
    unit: string;
  }
  const initialSpecifications: specification = {
    nameSpecification: "",
    valueOfEach: "",
    unit: "",
  };

  const initialValues: CreateProductFormSchema = {
    productName: "",
    origin: "",
    brand: "",
    description: "",
    images: [],
    serialNumber: "",
    model: "",
    regularPrice: 0,
    salePrice: 0,
    category: "",
    specification: [initialSpecifications],
    timeWarranty: 0,
  };

  const validationSchema = object().shape({
    productName: string().required("Bắt buộc có tên sản phẩm"),
    origin: string().required("Bắt buộc có xuất xứ"),
    brand: string().required("Bắt buộc có thương hiệu"),
    description: string().required("Bắt buộc có mô tả"),
    images: array().min(1, "Bắt buộc có hình"),
    serialNumber: string().required("Bắt buộc có mã sản phẩm"),
    model: string().required("Bắt buộc có mẫu sản phẩm"),
    regularPrice: number().moreThan(0, "Giá tiền lớn hơn 0"),
    salePrice: number().moreThan(0, "Giá tiền lớn hơn 0"),
    category: string().required("Phải có loại máy"),
    specification: array(
      object({
        nameSpecification: string().required("bắt buộc"),
        valueOfEach: string().required("bắt buộc"),
        unit: string().required("bắt buộc"),
      })
    ).min(1, "Ít nhất một thông số kỹ thuật là bắt buộc"),
    timeWarranty: number()
      .min(minTimeWarranty, `Thời gian bảo trì lớn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo trì nhỏ hơn ${maxTimeWarranty}`),
  });

  const handleCreateClick = async (values: CreateProductFormSchema) => {
    try {
      console.log(values);
      enqueueSnackbar("Create success");
    } catch (error) {
      console.error(error);
    }
  };

  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const hanldeRemoveFile = (file: UploadFile) => {
    const data = imagesUrl.reduce((acc: imageList[], curValue: imageList) => {
      return curValue.uid !== file.uid ? [...acc, curValue] : acc;
    }, []);
    setImagesUrl(data);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleCreateClick}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    required
                    name="productName"
                    label="Tên sản phẩm"
                    value={values.productName}
                    onChange={handleChange}
                    error={touched.productName && Boolean(errors.productName)}
                    helperText={touched.productName && errors.productName}
                    onBlur={handleBlur}
                  />

                  <div>
                    <LabelStyle>Mô tả</LabelStyle>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div>
                    <LabelStyle>Hình ảnh</LabelStyle>
                    <div>
                      <Upload
                        name="images"
                        listType="picture-card"
                        multiple
                        onPreview={handlePreview}
                        customRequest={async (options: UploadRequestOption) => {
                          const { file, onSuccess, onError } = options;

                          try {
                            const firebaseUrl = await uploadImageToFirebase(
                              file as RcFile
                            );
                            if (firebaseUrl) {
                              setFieldValue("images", [
                                ...values.images,
                                firebaseUrl,
                              ]); // Sửa đổi
                              onSuccess?.("ok");
                            } else {
                              onError?.(new Error("Upload to Firebase failed"));
                            }
                          } catch (error) {
                            onError?.(error as Error);
                          }
                        }}
                        onRemove={(file) => hanldeRemoveFile(file)}
                      >
                        {uploadButton}
                      </Upload>
                      <Modal
                        open={previewOpen}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ width: "90%" }}
                      >
                        <img
                          alt="example"
                          style={{ width: "100%" }}
                          src={previewImage}
                        />
                      </Modal>
                    </div>
                  </div>
                  <div>
                    <LabelStyle>Thông số kỹ thuật</LabelStyle>
                    <FieldArray name="specification">
                      {({ remove, push }) => (
                        <div>
                          {values.specification.length > 0 &&
                            values.specification.map(
                              (specification: specification, index) => (
                                <Stack
                                  direction="row"
                                  key={index}
                                  spacing={2}
                                  sx={{ mt: 2 }}
                                >
                                  <TextField
                                    required
                                    label="Tên thông số"
                                    sx={{ width: 200 }}
                                    name={`specification.${index}.nameSpecification`}
                                    value={specification.nameSpecification}
                                    onChange={handleChange}
                                    error={
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.nameSpecification`
                                        )
                                      ) &&
                                      getIn(
                                        touched,
                                        `specification.${index}.nameSpecification`
                                      )
                                    }
                                    helperText={
                                      getIn(
                                        touched,
                                        `specification.${index}.nameSpecification`
                                      ) &&
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.nameSpecification`
                                        )
                                      )
                                    }
                                  />
                                  <TextField
                                    required
                                    name={`specification.${index}.valueOfEach`}
                                    label="Giá trị"
                                    value={specification.valueOfEach}
                                    onChange={handleChange}
                                    error={
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.valueOfEach`
                                        )
                                      ) &&
                                      getIn(
                                        touched,
                                        `specification.${index}.valueOfEach`
                                      )
                                    }
                                    helperText={
                                      getIn(
                                        touched,
                                        `specification.${index}.valueOfEach`
                                      ) &&
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.valueOfEach`
                                        )
                                      )
                                    }
                                    sx={{ width: 100 }}
                                  />
                                  <TextField
                                    required
                                    name={`specification.${index}.unit`}
                                    label="Đơn vị"
                                    value={specification.unit}
                                    onChange={handleChange}
                                    error={
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.unit`
                                        )
                                      ) &&
                                      getIn(
                                        touched,
                                        `specification.${index}.unit`
                                      )
                                    }
                                    helperText={
                                      getIn(
                                        touched,
                                        `specification.${index}.unit`
                                      ) &&
                                      Boolean(
                                        getIn(
                                          errors,
                                          `specification.${index}.unit`
                                        )
                                      )
                                    }
                                    sx={{ width: 100 }}
                                  />

                                  <IconButton onClick={() => remove(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                              )
                            )}
                          <Button
                            sx={{ mt: 4 }}
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push(initialSpecifications)}
                          >
                            Thêm thông số
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mt={2}>
                    <TextField
                      required
                      name="brand"
                      label="Thương hiệu"
                      value={values.brand}
                      onChange={handleChange}
                      error={touched.brand && Boolean(errors.brand)}
                      helperText={touched.brand && errors.brand}
                      onBlur={handleBlur}
                    />

                    <TextField
                      required
                      name="origin"
                      label="Xuất xứ"
                      value={values.origin}
                      onChange={handleChange}
                      error={touched.origin && Boolean(errors.origin)}
                      helperText={touched.origin && errors.origin}
                      onBlur={handleBlur}
                    />

                    <TextField
                      required
                      name="serialNumber"
                      label="Mã sản phẩm"
                      value={values.serialNumber}
                      onChange={handleChange}
                      error={
                        touched.serialNumber && Boolean(errors.serialNumber)
                      }
                      helperText={touched.serialNumber && errors.serialNumber}
                      onBlur={handleBlur}
                    />

                    <TextField
                      required
                      name="model"
                      label="Mẫu sản phẩm"
                      value={values.model}
                      onChange={handleChange}
                      error={touched.model && Boolean(errors.model)}
                      helperText={touched.model && errors.model}
                      onBlur={handleBlur}
                    />

                    <TextField
                      select
                      required
                      name="category"
                      label="Chọn Loại máy"
                      value={values.category}
                      onChange={handleChange}
                      error={touched.category && Boolean(errors.category)}
                      helperText={touched.category && errors.category}
                      onBlur={handleBlur}
                    >
                      {CATEGORY_OPTION.map((category) => (
                        <MenuItem key={category.id} value={category.category}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      required
                      name="timeWarranty"
                      label="Thời gian bảo trì"
                      placeholder="0"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Năm</InputAdornment>
                        ),
                        type: "number",
                        inputProps: { min: 0, max: 2 },
                      }}
                      value={values.timeWarranty}
                      onChange={handleChange}
                      error={
                        touched.timeWarranty && Boolean(errors.timeWarranty)
                      }
                      helperText={touched.timeWarranty && errors.timeWarranty}
                      onBlur={handleBlur}
                    />
                  </Stack>
                </Card>

                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mb={2}>
                    <TextField
                      required
                      name="regularPrice"
                      label="Giá máy"
                      placeholder="0.00"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">VNĐ</InputAdornment>
                        ),
                        type: "number",
                        inputProps: { min: 0 },
                      }}
                      value={values.regularPrice}
                      onChange={handleChange}
                      error={
                        touched.regularPrice && Boolean(errors.regularPrice)
                      }
                      helperText={touched.regularPrice && errors.regularPrice}
                      onBlur={handleBlur}
                    />

                    <TextField
                      required
                      name="salePrice"
                      label="Giá bán"
                      placeholder="0.00"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">VNĐ</InputAdornment>
                        ),
                        type: "number",
                        inputProps: { min: 0 },
                      }}
                      value={values.salePrice}
                      onChange={handleChange}
                      error={touched.salePrice && Boolean(errors.salePrice)}
                      helperText={touched.salePrice && errors.salePrice}
                      onBlur={handleBlur}
                    />
                  </Stack>
                </Card>

                <Button type="submit" variant="contained" size="large">
                  Create Product
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
