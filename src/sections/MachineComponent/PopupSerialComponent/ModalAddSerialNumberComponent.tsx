import React from "react";
//model

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
import { GetMachineComponents } from "../../../models/machineComponent";

interface ModalSerialNumber {
  productData: GetMachineComponents | undefined;
  open: boolean;
  handleCLose: () => void;
  onSuccess: (response: string) => void;
}

interface addProps {
  machineryId: string;
  type: string;
}
interface quantitySerial {
  quantity: number;
}
const ModalAddSerialComponent: React.FC<ModalSerialNumber> = ({
  productData,
  open,
  handleCLose,
  onSuccess,
}) => {
  const { apiAddSerialbyComponentId } = ApiSerial();

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
          type: "Material",
        };
        const response = await apiAddSerialbyComponentId(params, data);

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
      title="Thêm bộ phận máy"
      open={open}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <TextField
            value={productData?.name}
            InputProps={{
              readOnly: true,
            }}
            label="Tên bộ phân"
          />
          <RHFTextField
            name="quantity"
            type="number"
            label="Số lượng"
            sx={{ mt: 2 }}
          />
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

export default ModalAddSerialComponent;
