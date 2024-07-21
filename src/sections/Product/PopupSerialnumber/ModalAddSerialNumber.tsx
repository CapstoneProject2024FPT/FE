import React from "react";
//model
import { ProductAdmin } from "../../../models/products";
// form
import { Modal } from "antd";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//api
import { ApiSerial } from "../../../api/services/apiSerialNumber";
import { useForm } from "react-hook-form";
import { RHFTextField, FormProvider } from "../../../components/hook-form";
import { Card, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface ModalSerialNumber {
  productData: ProductAdmin | undefined;
  open: boolean;
  handleCLose: () => void;
  onSuccess: (response: string) => void;
}

interface addProps {
  machineryId: string;
}
interface quantitySerial {
  quantity: number;
}
const ModalAddSerialPopup: React.FC<ModalSerialNumber> = ({
  productData,
  open,
  handleCLose,
  onSuccess,
}) => {
  const { apiAddSerialbyMachineId } = ApiSerial();

  const defaultValues = {
    quantity: 0,
  };

  const validationSchema = Yup.object().shape({
    quantity: Yup.number().required("bắt buộc").moreThan(0, "lớn hơn 0"),
  });

  const methods = useForm<quantitySerial>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: quantitySerial) => {
    try {
      if (productData) {
        const params: addProps = {
          machineryId: productData.id,
        };
        const response = await apiAddSerialbyMachineId(params, data);

        if (response.status === 200) {
          if (onSuccess) {
            onSuccess(response.data);
            reset();
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Thêm máy"
      open={open}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <TextField
            value={productData?.name || ""}
            sx={{ mb: 2 }}
            InputProps={{ readOnly: true }}
            label="Tên máy"
          />
          <RHFTextField name="quantity" type="number" label="Số lượng" />
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

export default ModalAddSerialPopup;
