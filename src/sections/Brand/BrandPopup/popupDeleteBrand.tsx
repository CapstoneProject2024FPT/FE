import React from "react";
//model
import { brandTable } from "../../../models/brand";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { BrandApi } from "../../../api/services/apiBrand";
//api

interface ModalBrand {
  BrandData: brandTable | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalBrandPopupDelete: React.FC<ModalBrand> = ({
  BrandData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, deleteBrand } = BrandApi();

  const onSubmit = async () => {
    try {
      if (BrandData) {
        const response = await deleteBrand(BrandData?.id);
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
      title="Khả Dụng Thương Hiệu"
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
        Bạn có muốn xoá loại máy tên: {BrandData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalBrandPopupDelete;
