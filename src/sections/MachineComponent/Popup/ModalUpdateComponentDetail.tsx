import React, { useEffect, useState } from "react";

import { Modal } from "antd";
import {
  FormProvider,
  RHFTextField,
  RHFAutoComplete,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Grid, InputAdornment, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { brandTable } from "../../../models/brand";
import { BrandApi } from "../../../api/services/apiBrand";
import { OriginProps } from "../../../models/origin";
import { ApiOrigin } from "../../../api/services/apiOrigin";
import {
  GetMachineComponents,
  UpdateProductComponent,
} from "../../../models/machineComponent";
import { MachineryComponentApi } from "../../../api/services/apiMachineComponent";

interface UpdateProductForm {
  name: string;
  originId: string;
  description: string;
  sellingPrice: number;
  brandId: string;
  timeWarranty: number;
}
interface ModalProduct {
  productData: GetMachineComponents | undefined;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

const ModalComponentDetail: React.FC<ModalProduct> = ({
  productData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const minTimeWarranty = 1;
  const maxTimeWarranty = 3;
  const { apiUpdateMachineryComponent } = MachineryComponentApi();
  const { getBrand } = BrandApi();
  const { apiGetOrigin } = ApiOrigin();

  const { id } = useParams<{ id: string }>();

  const [brands, setBrands] = useState<brandTable[]>();
  const [origins, setOrigins] = useState<OriginProps[]>();

  const fetchData = async () => {
    try {
      const params = {
        status: "Active",
      };
      const [origin, brand] = await Promise.allSettled([
        apiGetOrigin(),
        getBrand(params),
      ]);

      if (origin.status === "fulfilled") {
        setOrigins(origin.value.data);
      } else {
        console.error(origin.reason);
      }

      if (brand.status === "fulfilled") {
        setBrands(brand.value);
      } else {
        console.error(brand.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự").trim(),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự")
      .trim(),
    originId: Yup.string().required("Bắt buộc có xuất xứ"),
    brandId: Yup.string().required("Bắt buộc có hãng"),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo trì lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo trì nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo trì là bắt buộc"),
  });

  const defaultValues = {
    name: productData?.name || "",
    description: productData?.description || "",
    originId: productData?.origin?.id || "",
    sellingPrice: productData?.sellingPrice || 0,
    brandId: productData?.brand?.id || "",
    timeWarranty: productData?.timeWarranty || 0,
  };

  const methods = useForm<UpdateProductForm>({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: UpdateProductForm) => {
    try {
      if (productData) {
        const params: UpdateProductComponent = {
          //use spread operator to make the copy object
          ...data,
          categoryId: productData?.category?.id,
          status: productData?.status,
        };

        if (id) {
          const response = await apiUpdateMachineryComponent(id, params);

          if (response && response.status === 200) {
            onUpdateSuccess(response.data);
          } else {
            toast.error(response.Error);
          }
        }
      }

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Cập nhật chi tiết máy"
      open={open}
      onCancel={handleClose}
      footer={[]}
      width={800}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên Loại Máy" autoFocus />
            <RHFTextField
              name="description"
              label="Mô Tả Loại Máy"
              multiline
              rows={3}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Stack direction="column" display="flex" spacing={2}>
                  <RHFAutoComplete
                    name="brandId"
                    options={brands || []}
                    label="Thương hiệu máy"
                  />
                  <RHFTextField
                    select
                    name="originId"
                    label="Chọn xuất xứ "
                    SelectProps={{ native: true }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <option value="">Chọn Thương hiệu</option>
                    {origins && origins?.length > 0 ? (
                      origins?.map((origin) => (
                        <option key={origin.id} value={origin.id}>
                          {origin.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        không có quốc gia
                      </option>
                    )}
                  </RHFTextField>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="column" display="flex" spacing={2}>
                  <RHFTextField
                    name="sellingPrice"
                    type="number"
                    label="Giá bán"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VNĐ</InputAdornment>
                      ),
                      type: "number",
                      inputProps: { min: 0 },
                    }}
                  />
                  <RHFTextField
                    name="timeWarranty"
                    label="Số năm bảo hành"
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Năm</InputAdornment>
                      ),
                      type: "number",
                      inputProps: {
                        min: minTimeWarranty,
                        max: maxTimeWarranty,
                      },
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              loading={isSubmitting}
              variant="outlined"
              type="submit"
              sx={{
                marginTop: "5px",
              }}
            >
              Lưu Thay đổi
            </LoadingButton>
          </div>
        </Card>
      </FormProvider>
    </Modal>
  );
};

export default ModalComponentDetail;
