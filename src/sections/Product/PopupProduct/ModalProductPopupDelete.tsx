import React from "react";
//model

// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ProductAdmin } from "../../../models/products";
import { MachineryApi } from "../../../api/services/apiMachinery";

interface ModalCategory {
  ProductData: ProductAdmin | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalProductPopupDelete: React.FC<ModalCategory> = ({
  ProductData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, apiDeleteMachine } = MachineryApi();

  const onSubmit = async () => {
    try {
      if (ProductData) {
        const response = await apiDeleteMachine(ProductData?.id);
        console.log(response);

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
      title="Chi Tiết Loại Máy"
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
        Bạn có muốn xoá loại máy tên: {ProductData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalProductPopupDelete;
