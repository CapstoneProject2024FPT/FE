import { useEffect, useState } from "react";
//mui
import { Card, Grid, Stack, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
//models
import { OriginProps } from "../../models/origin";
import { machineComponentProps } from "../../models/machineComponent";
import { GetCategoryProps } from "../../models/category";
import { brandTable } from "../../models/brand";
// form
import {
  FormProvider,
  RHFAutoComplete,
  RHFTextField,
  RHFTextFieldNumber,
} from "../../components/hook-form";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//api
import { BrandApi } from "../../api/services/apiBrand";
import { ApiOrigin } from "../../api/services/apiOrigin";
import { MachineryComponentApi } from "../../api/services/apiMachineComponent";
import { CategoryComponentApi } from "../../api/services/apiCategoriesComponent";
//toast
import { toast } from "react-toastify";
import config from "../../configs";

export default function ProductNewComponent() {
  const { apiAddMachineryComponent } = MachineryComponentApi();
  const { getCategoryComponentChild } = CategoryComponentApi();
  const { getBrand } = BrandApi();
  const { apiGetOrigin } = ApiOrigin();

  const minTimeWarranty = 1;
  const maxTimeWarranty = 3;

  const [categories, setCategories] = useState<GetCategoryProps[]>();
  const [brands, setBrands] = useState<brandTable[]>();
  const [origins, setOrigins] = useState<OriginProps[]>();

  const defaultValues = {
    name: "",
    description: "",
    stockPrice: 0,
    sellingPrice: 0,
    timeWarranty: 0,
    categoryId: "",
    brandId: "",
    originId: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Bắt buộc có tên sản phẩm").trim(),
    originId: Yup.string().required("Bắt buộc có xuất xứ"),
    brandId: Yup.string().required("Bắt buộc có hãng"),
    description: Yup.string().required("Bắt buộc có mô tả").trim(),
    stockPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    categoryId: Yup.string().required("Phải có loại máy"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo hành lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo hành nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo hành là bắt buộc"),
  });

  const methods = useForm<machineComponentProps>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fetchData = async () => {
    try {
      const params = {
        status: "Active",
      };
      const [category, brand, origin] = await Promise.allSettled([
        getCategoryComponentChild(),
        getBrand(params),
        apiGetOrigin(),
      ]);

      if (category.status === "fulfilled") {
        setCategories(category.value);
      } else {
        console.error(category.reason);
      }

      if (brand.status === "fulfilled") {
        setBrands(brand.value);
      } else {
        console.error(brand.reason);
      }

      if (origin.status === "fulfilled") {
        setOrigins(origin.value.data);
      } else {
        console.error(origin.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: machineComponentProps) => {
    try {
      const response = await apiAddMachineryComponent(values);
      if (response.status === 200) {
        toast.success(config.AdminMessageNotice.AddMachineComponent);
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField required name="name" label="Tên chi tiết máy" />

              <div>
                <RHFTextField
                  required
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                />
              </div>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 2 }}>
            <Stack spacing={3} mb={2}>
              <RHFTextFieldNumber
                required
                type="number"
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

              <RHFTextFieldNumber
                required
                type="number"
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFAutoComplete
                  name="brandId"
                  options={brands || []}
                  label="Chọn Thương hiệu máy"
                />

                <RHFAutoComplete
                  name="originId"
                  options={origins || []}
                  label="Chọn xuất xứ"
                />

                <RHFAutoComplete
                  name="categoryId"
                  options={categories || []}
                  label="Chọn loại máy"
                />
                <RHFTextField
                  required
                  name="timeWarranty"
                  label="Thời gian bảo hành"
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Năm</InputAdornment>
                    ),
                    type: "number",
                    inputProps: { min: 0, max: maxTimeWarranty },
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
