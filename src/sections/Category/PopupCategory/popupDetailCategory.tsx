import React from "react";
import { CategoryProps, GetCategoryProps } from "../../../models/category";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { CategoryApi } from "../../../api/services/apiCategories";

interface ModalUser {
  CategoryData: GetCategoryProps | null;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

const ModalCategoryPopup: React.FC<ModalUser> = ({
  CategoryData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { updateCategory } = CategoryApi();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
  });

  const defaultValues: CategoryProps = {
    name: CategoryData?.name || "",
    description: CategoryData?.description || "",
  };

  const methods = useForm<CategoryProps>({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: CategoryProps) => {
    try {
      const param = { ...data, status: "Active" };
      if (CategoryData) {
        const response = await updateCategory(CategoryData?.id, param);
        if (onUpdateSuccess) {
          onUpdateSuccess(response);
        }
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Loại Máy"
      open={open}
      onCancel={handleClose}
      footer={[]}
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

export default ModalCategoryPopup;