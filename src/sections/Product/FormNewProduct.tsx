import { useCallback, useEffect, useState } from "react";
//mui
import {
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
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
import { useFieldArray, useForm } from "react-hook-form";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import { MachineryApi } from "../../api/services/apiMachinery";
import { CategoryApi } from "../../api/services/apiCategories";
import { GetCategoryProps } from "../../models/category";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function ProductNewEditForm() {
  const { apiAddMachinery } = MachineryApi();
  const { getCategory } = CategoryApi();

  const minTimeWarranty = 1;
  const maxTimeWarranty = 2;

  const initialSpecifications: Specification = {
    name: "",
    value: "",
  };

  const [categories, setCategories] = useState<GetCategoryProps[]>();

  const defaultValues = {
    name: "",
    origin: "",
    description: "",
    imageURL: [],
    model: "",
    quantity: 0,
    stockPrice: 0,
    sellingPrice: 0,
    categoryId: "",
    specificationList: [initialSpecifications],
    brand: "",
    timeWarranty: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Bắt buộc có tên sản phẩm"),
    origin: Yup.string().required("Bắt buộc có xuất xứ"),
    brand: Yup.string().required("Bắt buộc có hãng"),
    description: Yup.string().required("Bắt buộc có mô tả"),
    imageURL: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    model: Yup.string().required("Bắt buộc có mẫu sản phẩm"),
    stockPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    categoryId: Yup.string().required("Phải có loại máy"),
    specificationList: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required("bắt buộc"),
          value: Yup.string().required("bắt buộc"),
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
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specificationList",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //add machinery
  const onSubmit = async (values: CreateProductFormSchema) => {
    try {
      const transformedData = {
        ...values,
        image: values.imageURL?.map((image) => ({
          imageURL: image,
        })),
      };
      delete transformedData.imageURL;

      const response = await apiAddMachinery(transformedData);
      console.log(response);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.imageURL || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      // Update the form with the new image URLs
      setValue("imageURL", [...images, ...uploadedImages]);
    },
    [setValue, values.imageURL]
  );

  const handleRemoveAll = () => {
    setValue("imageURL", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageURL?.filter((_file) => _file !== file);
    setValue("imageURL", filteredItems);
  };

  const handleAddSpecification = () => {
    append(initialSpecifications);
  };

  const handleRemoveSpecification = (index: number) => {
    remove(index);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField required name="name" label="Tên sản phẩm" />

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
                  name="imageURL"
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
                  {fields.map((field, index) => (
                    <Stack
                      direction="row"
                      key={field.id}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <RHFTextField
                        required
                        sx={{ width: 250 }}
                        name={`specificationList[${index}].name`}
                        label="Tên thông số"
                      />
                      <RHFTextField
                        required
                        sx={{ width: 250 }}
                        name={`specificationList[${index}].value`}
                        label="Giá trị"
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

                <RHFTextField required name="model" label="Mẫu sản phẩm" />

                <RHFTextField
                  select
                  name="categoryId"
                  label="Chọn Loại máy"
                  SelectProps={{ native: true }}
                >
                  {categories && categories?.length > 0 ? (
                    categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
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
                  name="stockPrice"
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
                  name="sellingPrice"
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
