import React, { useEffect, useState } from "react";
// form
import { Modal } from "antd";
import {
  FormProvider,
  RHFAutoCompleteUser,
} from "../../../components/hook-form";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { toast } from "react-toastify";
//model
import { OrderProps } from "../../../models/order";
import { Card, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ApiTask } from "../../../api/services/apiTask";
import { DeliveryPropsPost } from "../../../models/task";
import { RoleType, staffProps } from "../../../models/UserData";
import { ApiAccount } from "../../../api/services/apiAccount";
//api

interface ModalOrder {
  OrderData: OrderProps | null;
  openTaskPopup: boolean;
  handleCLose: () => void;
  onCreateSuccess: (response: string) => void;
}

interface DeliveryProps {
  accountId: string;
}

const ModalDeliveryTask: React.FC<ModalOrder> = ({
  OrderData,
  openTaskPopup,
  handleCLose,
  onCreateSuccess,
}) => {
  const { apiCreateTask } = ApiTask();
  const { apiGetUserByRole } = ApiAccount();

  const [data, setData] = useState<staffProps[]>();

  const fetchAccountUser = async () => {
    const params = {
      Role: RoleType.TECHNICAL,
      size: 20,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
      setData(response.data.items);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchAccountUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DeliverySchema = Yup.object().shape({
    accountId: Yup.string().required("bắt buộc"),
  });

  const defaultValues: DeliveryProps = {
    accountId: "",
  };

  const methods = useForm<DeliveryProps>({
    resolver: yupResolver(DeliverySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: DeliveryProps) => {
    try {
      if (OrderData) {
        const params: DeliveryPropsPost = {
          accountId: data.accountId,
          status: "Process",
          orderId: OrderData.orderId,
          type: "Delivery",
        };
        const response = await apiCreateTask(params);
        if (response.status === 200) {
          if (onCreateSuccess) {
            onCreateSuccess("Giao nhiệm vụ thành công");
            reset();
          }
        } else {
          toast.error("Xảy ra lỗi trong quá trình thêm");
        }
      }
    } catch (error) {
      handleCLose();
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chấp nhận đơn hàng"
      open={openTaskPopup}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              value={OrderData?.invoiceCode}
              label="Mã đơn hàng"
              InputProps={{ readOnly: true }}
            />
            <RHFAutoCompleteUser
              label="Chọn Nhân Viên Kĩ Thuật"
              name="accountId"
              options={data || []}
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

export default ModalDeliveryTask;
