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
  openAcceptPopup: boolean;
  handleCLoseAccept: () => void;
  onUpdateSuccess: (response: string) => void;
}

const ModalAcceptOrder: React.FC<ModalOrder> = ({
  OrderData,
  openAcceptPopup,
  handleCLoseAccept,
  onUpdateSuccess,
}) => {
  const { loading, apiAcceptOrder } = ApiOrder();

  const onSubmit = async () => {
    try {
      if (OrderData) {
        const params = {
          status: StatusType.CONFIRMED,
          note: "",
        };
        const response = await apiAcceptOrder(OrderData?.orderId, params);
        if (response.status === 200) {
          if (onUpdateSuccess) {
            onUpdateSuccess("chấp nhận đơn hàng thành công");
          }
        } else {
          toast.error("Cập nhật đơn hàng thất bại");
        }
      }
    } catch (error) {
      handleCLoseAccept();
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Chấp nhận đơn hàng"
      open={openAcceptPopup}
      onOk={handleCLoseAccept}
      onCancel={handleCLoseAccept}
      footer={[
        <Button key="back" onClick={handleCLoseAccept}>
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
        Bạn có chấp nhận mã đơn: {OrderData?.invoiceCode}
      </Typography.Text>
    </Modal>
  );
};

export default ModalAcceptOrder;
