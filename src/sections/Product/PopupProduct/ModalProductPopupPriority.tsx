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
  originId: string;
  status: string;
  priority: number;
  brandId: string;
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
          originId: ProductData.origin.id,
          brandId: ProductData.brand.id,
          categoryId: ProductData.category.id,
          status: ProductData.status,
        };

        const response = await apiUpdatePriorityMachine(ProductData?.id, param);

        if (response.status === 200) {
          if (onUpdatePrioritySuccess) {
            onUpdatePrioritySuccess(response.data);
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("lỗi cập nhật");
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
