import React from "react";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";

import { toast } from "react-toastify";
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
import config from "../../../configs";

interface ModalCategory {
  open: boolean;
  handleClose: () => void;
  onAddSuccess?: () => void;
}
interface NewsCategoryProps {
  name: string;
  description: string;
}
const ModalNewsCategoryPopupAdd: React.FC<ModalCategory> = ({
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { addNewsCategories } = ApiNewsCategories();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
  });

  const defaultValues: NewsCategoryProps = {
    name: "",
    description: "",
  };

  const methods = useForm<NewsCategoryProps>({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: NewsCategoryProps) => {
    try {
      const response = await addNewsCategories(data);
      if (response.status === 200) {
        if (onAddSuccess) {
          onAddSuccess();
          reset();
        }
      } else {
        toast.error(config.AdminMessageNotice.AddBrandFailed);
      }
    } catch (error) {
      handleClose();
      console.error(error);
    }
  };
  return (
    <Modal
      title="Thêm loại tin tức"
      open={open}
      onCancel={handleClose}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên Loại tin tức" autoFocus />
            <RHFTextField
              name="description"
              label="Mô Tả Loại Tin tức"
              multiline
              rows={5}
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

export default ModalNewsCategoryPopupAdd;
