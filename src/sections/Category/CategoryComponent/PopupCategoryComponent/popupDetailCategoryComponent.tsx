import React, { useEffect, useState } from "react";
import { GetCategoryProps } from "../../../../models/category";
import { Modal } from "antd";
import {
  FormProvider,
  RHFAutoComplete,
  RHFTextField,
} from "../../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { CategoryComponentApi } from "../../../../api/services/apiCategoriesComponent";

interface ModalUser {
  CategoryData: GetCategoryProps | null;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

interface CategoryProps {
  name: string;
  description: string;
  masterCategoryId: string;
}

const ModalCategoryPopupComponent: React.FC<ModalUser> = ({
  CategoryData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { updateCategoryComponent, getCategoryComponent } =
    CategoryComponentApi();
  const [categories, setCategories] = useState<GetCategoryProps[]>([]);

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(10, "Tối thiểu 10 kí tự"),
    masterCategoryId: Yup.string().required("bắt buộc chọn"),
  });

  const defaultValues: CategoryProps = {
    name: CategoryData?.name || "",
    description: CategoryData?.description || "",
    masterCategoryId: CategoryData?.masterCategoryId || "",
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

  //api
  const fetchCategories = async () => {
    try {
      const data = await getCategoryComponent();
      setCategories(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: CategoryProps) => {
    try {
      const param = {
        ...data,
        status: "Active",
        kind: "Material",
      };
      if (CategoryData) {
        const response = await updateCategoryComponent(CategoryData?.id, param);
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
              rows={5}
            />
            <RHFAutoComplete
              label="Chọn loại vật liệu"
              name="masterCategoryId"
              options={categories || []}
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

export default ModalCategoryPopupComponent;
