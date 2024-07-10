import React from "react";
// form
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Modal, Typography } from "antd";
import { toast } from "react-toastify";

//model
import { OrderProps } from "../../../models/order";
//api
import { ApiOrder } from "../../../api/services/apiOrder";
import { Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface ModalOrder {
  OrderData: OrderProps | null;
  openCancelPopup: boolean;
  handleCloseCancelPopup: () => void;
  onCancelSuccess: (response: string) => void;
}

interface CancelProps {
  note: string;
}
const ModalCancelOrder: React.FC<ModalOrder> = ({
  OrderData,
  openCancelPopup,
  handleCloseCancelPopup,
  onCancelSuccess,
}) => {
  const { apiCancelOrder } = ApiOrder();

  const BrandSchema = Yup.object().shape({
    note: Yup.string().required("bắt buộc").min(5, "Tối thiểu 5 kí tự"),
  });

  const defaultValues: CancelProps = {
    note: "",
  };

  const methods = useForm<CancelProps>({
    resolver: yupResolver(BrandSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: CancelProps) => {
    try {
      if (OrderData) {
        const params = {
          orderId: OrderData.orderId,
          status: "Canceled",
          note: data.note,
        };
        const response = await apiCancelOrder(params);
        if (response.status === 200) {
          if (onCancelSuccess) {
            reset();
            onCancelSuccess("Cập nhật đơn hàng thành công");
          }
        } else {
          toast.error("Cập nhật đơn hàng thất bại");
        }
      }
    } catch (error) {
      handleCloseCancelPopup();
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Huỷ đơn hàng"
      open={openCancelPopup}
      onOk={handleCloseCancelPopup}
      onCancel={handleCloseCancelPopup}
      footer={[]}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography.Text>
              Bạn có muốn huỷ đơn có mã: {OrderData?.invoiceCode}
            </Typography.Text>
            <RHFTextField name="note" label="Lý do" multiline rows={5} />
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

export default ModalCancelOrder;
