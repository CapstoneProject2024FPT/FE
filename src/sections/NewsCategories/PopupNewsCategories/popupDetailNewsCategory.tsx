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
import { NewsCategoryProps } from "../../../models/newCategories";

interface ModalUser {
  NewsCategoryData: NewsCategoryProps | null;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

interface NewsCategory {
  name: string;
  description: string;
}

const ModalNewsCategoryPopup: React.FC<ModalUser> = ({
  NewsCategoryData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { updateNewsCategory } = ApiNewsCategories();
  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
  });

  const defaultValues: NewsCategory = {
    name: NewsCategoryData?.name || "",
    description: NewsCategoryData?.description || "",
  };

  const methods = useForm<NewsCategory>({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: NewsCategory) => {
    try {
      if (NewsCategoryData) {
        const param = {
          ...data,
          status: NewsCategoryData.status,
        };
        const response = await updateNewsCategory(NewsCategoryData?.id, param);

        if (response.status === 200) {
          if (onUpdateSuccess) {
            onUpdateSuccess(response.data);
          }
        } else {
          toast.error("Có lỗi trong quá trình cập nhật");
        }
      }
      reset();
    } catch (error) {
      handleClose();
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chi Tiết Loại Tin tức"
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
              rows={5}
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

export default ModalNewsCategoryPopup;
