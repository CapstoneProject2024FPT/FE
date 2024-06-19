import React from "react";

import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Grid, InputAdornment, Stack } from "@mui/material";
import { ProductDetailProps, UpdateProduct } from "../../../models/products";
import { MachineryApi } from "../../../api/services/apiMachinery";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface UpdateProductForm {
  name: string;
  origin: string;
  model: string;
  description: string;
  sellingPrice: number;
  brand: string;
  timeWarranty: number;
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
  const minTimeWarranty = 12;
  const maxTimeWarranty = 36;
  const { apiUpdateMachineryDetail } = MachineryApi();

  const { id } = useParams<{ id: string }>();

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
    origin: Yup.string().required("Bắt buộc có xuất xứ"),
    brand: Yup.string().required("Bắt buộc có hãng"),
    model: Yup.string().required("Bắt buộc có mẫu sản phẩm"),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo trì lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo trì nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo trì là bắt buộc"),
  });

  const defaultValues: UpdateProductForm = {
    name: productData?.name || "",
    description: productData?.description || "",
    origin: productData?.origin || "",
    model: productData?.model || "",
    sellingPrice: productData?.sellingPrice || 0,
    brand: productData?.brand || "",
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
      const params: UpdateProduct = {
        //use spread operator to make the copy object
        ...data,
        categoryId: productData?.category?.id,
      };
      if (id) {
        const response = await apiUpdateMachineryDetail(id, params);

        console.log(response);

        if (response && response.status === 200) {
          onUpdateSuccess(response.data);
        } else {
          toast.error(response.Error);
        }
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Máy"
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
                  <RHFTextField name="brand" label="Thương hiệu" autoFocus />
                  <RHFTextField name="model" label="Mẫu sản phẩm" autoFocus />
                  <RHFTextField name="origin" label="Xuất xứ" autoFocus />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="column" display="flex" spacing={2}>
                  <RHFTextField
                    name="sellingPrice"
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
                        <InputAdornment position="end">Tháng</InputAdornment>
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

export default ModalProductDetailPopup;
