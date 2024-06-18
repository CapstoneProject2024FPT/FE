import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, TextField } from "@mui/material";
import { CategoryApi } from "../../../api/services/apiCategories";
import { GetCategoryProps } from "../../../models/category";
import { toast } from "react-toastify";

interface ModalCategory {
  open: boolean;
  handleClose: () => void;
  onAddSuccess?: () => void;
}
interface CategoryProps {
  name: string;
  description: string;
}
const ModalCategoryPopupAdd: React.FC<ModalCategory> = ({
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { addCategory, getCategoryParent } = CategoryApi();

  const [categories, setCategories] = useState<GetCategoryProps[]>([]);
  const [selectCategory, setSelectCategory] = useState<string>();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
  });

  const defaultValues: CategoryProps = {
    name: "",
    description: "",
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
      const data = await getCategoryParent();
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
      const dataSend = {
        ...data,
        masterCategoryId: selectCategory,
      };
      console.log(dataSend);

      await addCategory(dataSend);
      if (onAddSuccess) {
        onAddSuccess();
      }

      reset();
    } catch (error) {
      handleClose();
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
            <TextField
              select
              label="Chọn Loại máy"
              SelectProps={{ native: true }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setSelectCategory(e.target.value);
              }}
            >
              <option value="">Chọn loại máy</option>
              {categories && categories?.length > 0 ? (
                categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có loại máy
                </option>
              )}
            </TextField>
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

export default ModalCategoryPopupAdd;
