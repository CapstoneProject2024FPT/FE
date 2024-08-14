import React from "react";
//model
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { ApiDiscount } from "../../../api/services/apiDiscount";
import { DiscountProps } from "../../../models/discount";
//api

interface ModalBrand {
  DiscountData: DiscountProps | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalCloseDiscount: React.FC<ModalBrand> = ({
  DiscountData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, apiCloseDiscount } = ApiDiscount();

  const onSubmit = async () => {
    try {
      if (DiscountData?.status === "Active") {
        const response = await apiCloseDiscount(DiscountData?.id);
        if (onDeleteSuccess) {
          onDeleteSuccess(response);
        }
      }
    } catch (error) {
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Bỏ giảm giá"
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
      <Typography.Text>
        Bạn có muốn xoá thương hiệu máy tên: {DiscountData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalCloseDiscount;
