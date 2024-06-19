import React from "react";
//model

// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ProductAdmin } from "../../../models/products";
import { MachineryApi } from "../../../api/services/apiMachinery";

interface ModalProduct {
  ProductData: ProductAdmin | null;
  openPriorityPopup: boolean;
  handleCLosePriority: () => void;
  onUpdatePrioritySuccess: (response: string) => void;
}

interface priorityProps {
  priority: number;
  categoryId: string;
}
const ModalProductPopupPriority: React.FC<ModalProduct> = ({
  ProductData,
  openPriorityPopup,
  handleCLosePriority,
  onUpdatePrioritySuccess,
}) => {
  const { loading, apiUpdatePriorityMachine } = MachineryApi();

  const onSubmit = async () => {
    let priority = 0;

    if (ProductData?.priority === 1) {
      priority = 0;
    } else {
      priority = 1;
    }

    try {
      if (ProductData) {
        const param: priorityProps = {
          priority: priority,
          categoryId: ProductData?.category?.id,
        };
        const response = await apiUpdatePriorityMachine(ProductData?.id, param);
        if (onUpdatePrioritySuccess) {
          onUpdatePrioritySuccess(response);
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
      open={openPriorityPopup}
      onOk={handleCLosePriority}
      onCancel={handleCLosePriority}
      footer={[
        <Button key="back" onClick={handleCLosePriority}>
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
        Bạn có muốn chỉnh độ ưu tiên loại máy tên: {ProductData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalProductPopupPriority;
