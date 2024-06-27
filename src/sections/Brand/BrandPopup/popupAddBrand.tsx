import React, { useCallback } from "react";
import { Modal } from "antd";
import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography, styled } from "@mui/material";
import { toast } from "react-toastify";
import { BrandApi } from "../../../api/services/apiBrand";
import { brandProps } from "../../../models/brand";
import uploadImageToFirebase from "../../../firebase/uploadImageToFirebase";

interface ModalBrand {
  open: boolean;
  handleClose: () => void;
  onAddSuccess?: () => void;
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const ModalBrandPopupAdd: React.FC<ModalBrand> = ({
  open,
  handleClose,
  onAddSuccess,
}) => {
  const { addBrand } = BrandApi();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
    urlImage: Yup.string().required("bắt buộc có hình"),
  });

  const defaultValues = {
    name: "",
    description: "",
    urlImage: "",
  };

  const methods = useForm<brandProps>({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: brandProps) => {
    try {
      await addBrand(data);
      if (onAddSuccess) {
        onAddSuccess();
      }
      reset();
    } catch (error) {
      handleClose();
      toast.error("Xảy ra lỗi trong quá trình thêm");
      console.error(error);
    }
  };
  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];

      const coverImage = await uploadImageToFirebase(file);
      if (typeof coverImage === "string") {
        setValue("urlImage", coverImage);
      }
    },
    [setValue]
  );

  return (
    <Modal
      title="Thêm Thương Hiệu Máy"
      open={open}
      onCancel={handleClose}
      footer={[]}
      width={700}
      style={{ top: 0 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Tên Thương Hiệu Máy" autoFocus />
            <RHFTextField
              name="description"
              label="Mô Tả "
              multiline
              rows={3}
            />
            <div>
              <LabelStyle>Ảnh</LabelStyle>
              <RHFUploadSingleFile
                name="urlImage"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </div>
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

export default ModalBrandPopupAdd;
