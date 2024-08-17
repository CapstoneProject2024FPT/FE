import React, { useEffect, useState } from "react";

import { Modal } from "antd";
import {
  FormProvider,
  RHFTextField,
  RHFAutoComplete,
  RHFTextFieldNumber,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { ProductDetailProps, UpdateProduct } from "../../../models/products";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { brandTable } from "../../../models/brand";
import { BrandApi } from "../../../api/services/apiBrand";
import { OriginProps } from "../../../models/origin";
import { ApiOrigin } from "../../../api/services/apiOrigin";
import config from "../../../configs";
import { formatNumberWithCommas } from "../../../utils/fn";

interface UpdateProductForm {
  name: string;
  originId: string;
  model: string;
  description: string;
  sellingPrice: number;
  brandId: string;
  timeWarranty: number;
  monthWarrantyNumber: number;
}
interface ModalProduct {
  productData: ProductDetailProps | undefined;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

const ModalProductDetailPopup: React.FC<ModalProduct> = ({
  productData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const minTimeWarranty = 1;
  const maxTimeWarranty = 3;

  const minTimeMonthWarranty = 3;
  const maxTimeMonthWarranty = 6;
  const { apiUpdateMachineryDetail } = MachineryApi();
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
    model: Yup.string().required("Bắt buộc có mẫu sản phẩm").trim(),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo hành lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo hành nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo hành là bắt buộc"),
    monthWarrantyNumber: Yup.number()
      .min(
        minTimeMonthWarranty,
        `Thời gian bảo hành lớn hơn ${minTimeMonthWarranty}`
      )
      .max(
        maxTimeMonthWarranty,
        `Thời gian bảo hành nhỏ hơn ${maxTimeMonthWarranty}`
      )
      .required("Thời gian bảo hành là bắt buộc"),
  });

  const defaultValues: UpdateProductForm = {
    name: productData?.name || "",
    description: productData?.description || "",
    originId: productData?.origin?.id || "",
    model: productData?.model || "",
    sellingPrice: productData?.sellingPrice || 0,
    brandId: productData?.brand?.id || "",
    timeWarranty: productData?.timeWarranty || 0,
    monthWarrantyNumber: productData?.monthWarrantyNumber || 0,
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
        if (data.sellingPrice < productData.stockPrice) {
          toast.error(config.AdminMessageNotice.SellingPriceMoreThanStockPrice);
          return;
        }
        const params: UpdateProduct = {
          ...data,
          categoryId: productData?.category?.id,
          status: productData?.status,
        };

        if (id) {
          const response = await apiUpdateMachineryDetail(id, params);

          if (response && response.status === 200) {
            reset();
            onUpdateSuccess(response.data);
          } else {
            toast.error(response.Error);
          }
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorUpdate);
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
                  <RHFTextField name="model" label="Mẫu sản phẩm" autoFocus />
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
                  <TextField
                    value={formatNumberWithCommas(productData?.stockPrice || 0)}
                    label="Giá nhập"
                    type="text"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VNĐ</InputAdornment>
                      ),
                      inputProps: { min: 0 },
                    }}
                    disabled
                  />
                  <RHFTextFieldNumber
                    name="sellingPrice"
                    label="Giá bán"
                    type="number"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VNĐ</InputAdornment>
                      ),
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
                  <RHFTextField
                    name="monthWarrantyNumber"
                    label="Số tháng bảo hành định kỳ"
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Tháng</InputAdornment>
                      ),
                      type: "number",
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

export default ModalProductDetailPopup;
