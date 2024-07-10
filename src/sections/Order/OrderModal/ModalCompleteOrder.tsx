import React from "react";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//model
import { OrderProps, StatusType } from "../../../models/order";
//api
import { ApiOrder } from "../../../api/services/apiOrder";

interface ModalOrder {
  OrderData: OrderProps | null;
  openCompletePopup: boolean;
  handleCLoseComplete: () => void;
  onCompleteSuccess: (response: string) => void;
}

const ModalCompleteOrder: React.FC<ModalOrder> = ({
  OrderData,
  openCompletePopup,
  handleCLoseComplete,
  onCompleteSuccess,
}) => {
  const { loading, apiCompleteOrder } = ApiOrder();

  const onSubmit = async () => {
    try {
      if (OrderData) {
        const params = {
          status: StatusType.COMPLETED,
          note: "",
        };
        const response = await apiCompleteOrder(OrderData?.orderId, params);
        if (response.status === 200) {
          if (onCompleteSuccess) {
            onCompleteSuccess("Cập nhật đơn hàng thành công");
          }
        } else {
          toast.error("Cập nhật đơn hàng thất bại");
        }
      }
    } catch (error) {
      handleCLoseComplete();
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Hoàn thành đơn hàng"
      open={openCompletePopup}
      onOk={handleCLoseComplete}
      onCancel={handleCLoseComplete}
      footer={[
        <Button key="back" onClick={handleCLoseComplete}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          Đồng Ý
        </Button>,
      ]}
    >
      <Typography.Text>
        Bạn có muốn hoàn thành đơn có mã: {OrderData?.invoiceCode}
      </Typography.Text>
    </Modal>
  );
};

export default ModalCompleteOrder;
