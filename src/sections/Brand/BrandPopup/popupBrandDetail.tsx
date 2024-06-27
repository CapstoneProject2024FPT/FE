import React from "react";
import { Modal } from "antd";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
//component
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
import { toast } from "react-toastify";
import Image from "../../../components/Image";
import { brandTable } from "../../../models/brand";
import { BrandApi } from "../../../api/services/apiBrand";

interface ModalBrand {
  BrandData: brandTable | null;
  open: boolean;
  handleClose: () => void;
  onUpdateSuccess: (response: string) => void;
}

interface BrandProps {
  name: string;
  description: string;
}
const ModalBrandPopupDetail: React.FC<ModalBrand> = ({
  BrandData,
  open,
  handleClose,
  onUpdateSuccess,
}) => {
  const { updateBrand } = BrandApi();
  const BrandSchema = Yup.object().shape({
    name: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
    description: Yup.string()
      .required("bắt buộc")
      .min(20, "Tối thiểu 20 kí tự"),
  });

  const defaultValues: BrandProps = {
    name: BrandData?.name || "",
    description: BrandData?.description || "",
  };

  const methods = useForm<BrandProps>({
    resolver: yupResolver(BrandSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: BrandProps) => {
    try {
      if (BrandData) {
        const param = {
          ...data,
          urlImage: BrandData.urlImage,
          status: "Active",
        };
        const response = await updateBrand(BrandData?.id, param);
        if (onUpdateSuccess) {
          onUpdateSuccess(response);
        }
      }
      reset();
    } catch (error) {
      toast.error("Có lỗi trong quá trình cập nhât");
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
      style={{ top: 50 }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Image
              src={BrandData?.urlImage}
              style={{
                marginBottom: "5px",
                height: "116px",
                maxWidth: "424px",
                objectFit: "contain",
              }}
            />
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

export default ModalBrandPopupDetail;
