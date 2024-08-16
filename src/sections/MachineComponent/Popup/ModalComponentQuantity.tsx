import React from "react";
//model

// form
import { Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { GetMachineComponents } from "../../../models/machineComponent";
import { MachineryComponentApi } from "../../../api/services/apiMachineComponent";
import { Button, Card } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import config from "../../../configs";

interface ModalCategory {
  ProductData: GetMachineComponents | null;
  openPopup: boolean;
  handleCLose: () => void;
  onUpdateSuccess: () => void;
}

interface UpdateQuantity {
  quantity: number;
}
const ModalComponentQuantity: React.FC<ModalCategory> = ({
  ProductData,
  openPopup,
  handleCLose,
  onUpdateSuccess,
}) => {
  const { apiUpdateComponentQuantity } = MachineryComponentApi();

  const ProductSchema = Yup.object().shape({
    quantity: Yup.number()
      .required("bắt buộc")
      .min(0, "Số lượng không thể âm")
      .test(
        "is-less-than-or-equal",
        "Số lượng không thể nhỏ hơn số lượng hiện tại",
        function (value) {
          return (
            value === undefined ||
            ProductData?.quantity === undefined ||
            value >= ProductData.quantity
          );
        }
      ),
  });

  const defaultValues = {
    quantity: ProductData?.quantity || 0,
  };

  const methods = useForm<UpdateQuantity>({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: UpdateQuantity) => {
    try {
      if (ProductData) {
        const params = {
          originId: ProductData.origin.id,
          brandId: ProductData.brand.id,
          status: ProductData.status,
          categoryId: ProductData.category.id,
          quantity: data.quantity,
        };

        const response = await apiUpdateComponentQuantity(
          ProductData?.id,
          params
        );

        if (response.status === 200) {
          if (onUpdateSuccess) {
            reset();
            onUpdateSuccess();
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.FailAddQuantity);
      console.error(error);
    }
  };
  return (
    <Modal
      title="Thêm số lượng chi tiết máy"
      open={openPopup}
      onOk={handleCLose}
      onCancel={handleCLose}
      width={600}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 2, p: 3 }}>
          <Typography.Text style={{ fontSize: "16px" }}>
            Tên chi tiết máy: {ProductData?.name}
          </Typography.Text>
          <RHFTextField name="quantity" type="number" />
        </Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={handleCLose}>
            Huỷ
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            type="submit"
            sx={{
              marginTop: "5px",
            }}
          >
            Cập nhật
          </LoadingButton>
        </div>
      </FormProvider>
    </Modal>
  );
};

export default ModalComponentQuantity;
