import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, TextField } from "@mui/material";
import { CategoryApi } from "../../../../api/services/apiCategories";
import { GetCategoryProps } from "../../../../models/category";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";

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
        kind: "Machinery",
      };

      const response = await addCategory(dataSend);
      if (response.status === 200) {
        if (onAddSuccess) {
          onAddSuccess();
        }
      } else {
        toast.error(response.Error);
      }

      reset();
    } catch (error) {
      handleClose();
      console.error(error);
    }
  };
  return (
    <Modal title="Thêm Loại Máy" open={open} onCancel={handleClose} footer={[]}>
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
            <Autocomplete
              options={categories}
              getOptionLabel={(category) => category.name}
              onChange={(_e, newValue) => {
                setSelectCategory(newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn Loại máy"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
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

export default ModalCategoryPopupAdd;
