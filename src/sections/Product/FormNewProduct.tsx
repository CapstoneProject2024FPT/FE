import { useCallback, useState } from "react";
//mui
import {
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
//models
import { CreateProductFormSchema, Specification } from "../../models/products";
// form
import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";

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

export default function ProductNewEditForm() {
  const minTimeWarranty = 1;
  const maxTimeWarranty = 2;

  const initialSpecifications: Specification = {
    nameSpecification: "",
    valueOfEach: 0,
    unit: "",
  };

  const [specifications, setSpecifications] = useState<Specification[]>([
    initialSpecifications,
  ]);

  const defaultValues = {
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

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Bắt buộc có tên sản phẩm"),
    origin: Yup.string().required("Bắt buộc có xuất xứ"),
    brand: Yup.string().required("Bắt buộc có thương hiệu"),
    description: Yup.string().required("Bắt buộc có mô tả"),
    images: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    serialNumber: Yup.string().required("Bắt buộc có mã sản phẩm"),
    model: Yup.string().required("Bắt buộc có mẫu sản phẩm"),
    regularPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    salePrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    category: Yup.string().required("Phải có loại máy"),
    specification: Yup.array()
      .of(
        Yup.object({
          nameSpecification: Yup.string().required("bắt buộc"),
          valueOfEach: Yup.number()
            .required("bắt buộc")
            .moreThan(1, "Phải lớn hơn 1"),
          unit: Yup.string().required("bắt buộc"),
        })
      )
      .min(1, "Ít nhất một thông số kỹ thuật là bắt buộc"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo trì lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo trì nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo trì là bắt buộc"),
  });

  const methods = useForm<CreateProductFormSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const onSubmit = async (values: CreateProductFormSchema) => {
    try {
      console.log(values);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.images || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      // Update the form with the new image URLs
      setValue("images", [...images, ...uploadedImages]);
    },
    [setValue, values.images]
  );

  const handleRemoveAll = () => {
    setValue("images", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue("images", filteredItems);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, initialSpecifications]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(
      specifications.filter((_, i) => {
        return i !== index;
      })
    );
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField required name="productName" label="Tên sản phẩm" />

              <div>
                <LabelStyle>Mô tả</LabelStyle>
                <RHFTextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                />
              </div>

              <div>
                <LabelStyle>Hình ảnh</LabelStyle>
                <RHFUploadMultiFile
                  showPreview
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUpload={() => console.log("ON UPLOAD")}
                />
              </div>
              <div>
                <LabelStyle>Thông số kỹ thuật</LabelStyle>
                <div
                  style={{
                    maxHeight: "500px",
                    overflow: "auto",
                  }}
                >
                  {specifications.map((_specification, index) => (
                    <Stack
                      direction="row"
                      key={index}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <RHFTextField
                        required
                        sx={{ width: 200 }}
                        name={`specification[${index}].nameSpecification`}
                        label="Tên thông số"
                      />
                      <RHFTextField
                        required
                        InputProps={{
                          type: "number",
                          inputProps: { min: 0 },
                        }}
                        sx={{ width: 100 }}
                        name={`specification[${index}].valueOfEach`}
                        label="Giá trị"
                      />
                      <RHFTextField
                        required
                        name={`specification[${index}].unit`}
                        label="Đơn vị"
                        sx={{ width: 100 }}
                      />

                      <IconButton
                        onClick={() => handleRemoveSpecification(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    sx={{ mt: 4 }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddSpecification}
                  >
                    Thêm thông số
                  </Button>
                </div>
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField required name="brand" label="Thương hiệu" />

                <RHFTextField required name="origin" label="Xuất xứ" />

                <RHFTextField
                  required
                  name="serialNumber"
                  label="Mã sản phẩm"
                />

                <RHFTextField required name="model" label="Mẫu sản phẩm" />

                <RHFTextField
                  select
                  required
                  name="category"
                  label="Chọn Loại máy"
                >
                  {CATEGORY_OPTION.map((category) => (
                    <MenuItem key={category.id} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </RHFTextField>

                <RHFTextField
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
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
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
                />

                <RHFTextField
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
                />
              </Stack>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Thêm sản phẩm
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
