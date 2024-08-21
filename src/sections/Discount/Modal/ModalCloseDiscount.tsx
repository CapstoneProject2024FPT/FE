import React from "react";
//model
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { ApiDiscount } from "../../../api/services/apiDiscount";
import { DiscountProps } from "../../../models/discount";
import config from "../../../configs";
//api

interface ModalDiscount {
  DiscountData: DiscountProps | undefined;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalCloseDiscount: React.FC<ModalDiscount> = ({
  DiscountData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, apiCloseDiscount, apiOpenDiscount } = ApiDiscount();

  const onSubmit = async () => {
    try {
      if (DiscountData?.status === "Active") {
        const response = await apiCloseDiscount(DiscountData?.id);
        if (response.status === 200) {
          if (onDeleteSuccess) {
            onDeleteSuccess(config.AdminMessageNotice.CloseDiscount);
          }
        }
      } else {
        if (!DiscountData) return;
        const params = {
          name: DiscountData?.name,
          type: DiscountData?.type,
          status: "Active",
          value: DiscountData?.value,
        };
        const response = await apiOpenDiscount(DiscountData?.id, params);
        if (response.status === 200) {
          if (onDeleteSuccess) {
            onDeleteSuccess(config.AdminMessageNotice.CloseDiscount);
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorDiscount);
      console.error(error);
    }
  };
  return (
    <Modal
      title={
        DiscountData?.status === "Active" ? "Đóng giảm giá" : "Mở giảm giá"
      }
      open={openDeletePopup}
      onOk={handleCLoseDelete}
      onCancel={handleCLoseDelete}
      footer={[
        <Button key="back" onClick={handleCLoseDelete}>
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
      {DiscountData?.status === "Active" ? (
        <Typography.Text style={{ fontSize: "15px" }}>
          Bạn có muốn đóng chương trình giảm giá: {DiscountData?.name}
        </Typography.Text>
      ) : (
        <Typography.Text style={{ fontSize: "15px" }}>
          Bạn có muốn mở lại chương trình giảm giá này: {DiscountData?.name}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ModalCloseDiscount;
