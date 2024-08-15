import React from "react";
import { Modal } from "antd";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFTextFieldNumber,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { toast } from "react-toastify";
import config from "../../../configs";
import { DiscountAdd, typeMapping } from "../../../models/discount";
import { ApiDiscount } from "../../../api/services/apiDiscount";

interface ModalBrand {
  open: boolean;
  handleClose: () => void;
  onAddSuccess?: (response: string) => void;
}

const ModalCreateDiscount: React.FC<ModalBrand> = ({
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { apiAddDiscount } = ApiDiscount();

  const DiscountSchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự").trim(),
    type: Yup.string().required("bắt buộc"),
    value: Yup.number()
      .min(2, "Không thể nhỏ hơn 2")
      .max(20, "Không thể lớn hơn 20")
      .required(),
  });

  const defaultValues = {
    name: "",
    type: "",
    value: 0,
  };

  const methods = useForm<DiscountAdd>({
    resolver: yupResolver(DiscountSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: DiscountAdd) => {
    try {
      const response = await apiAddDiscount(data);
      console.log(response);

      if (onAddSuccess) {
        onAddSuccess(config.AdminMessageNotice.CreateDiscount);
      }
      reset();
    } catch (error) {
      handleClose();
      toast.error(config.AdminMessageNotice.ErrorDiscount);
      console.error(error);
    }
  };

  return (
    <Modal
      title="Thêm giảm giá"
      open={open}
      onCancel={handleClose}
      footer={[]}
      width={700}
      style={{ top: 0 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField
              name="name"
              label="Tên chương trình giảm giá"
              autoFocus
            />
            <RHFSelect name="type" label="Loại hình giảm giá">
              {typeMapping?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </RHFSelect>
            <RHFTextFieldNumber
              name="value"
              type="number"
              label="Phần trăm giảm"
              autoFocus
            />
          </Stack>
          <div
            style={{
              display: " flex",
              justifyContent: "flex-end",
              marginTop: "5px",
            }}
          >
            <LoadingButton
              loading={isSubmitting}
              variant="outlined"
              type="submit"
            >
              Lưu
            </LoadingButton>
          </div>
        </Card>
      </FormProvider>
    </Modal>
  );
};

export default ModalCreateDiscount;
