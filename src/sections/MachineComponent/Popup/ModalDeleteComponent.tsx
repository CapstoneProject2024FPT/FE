import React from "react";
//model

// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { GetMachineComponents } from "../../../models/machineComponent";
import { MachineryComponentApi } from "../../../api/services/apiMachineComponent";

interface ModalCategory {
  ProductData: GetMachineComponents | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalDeleteComponent: React.FC<ModalCategory> = ({
  ProductData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, apiDeleteMachineryComponent } = MachineryComponentApi();

  const onSubmit = async () => {
    try {
      if (ProductData) {
        const response = await apiDeleteMachineryComponent(ProductData?.id);

        if (response.status === 200) {
          if (onDeleteSuccess) {
            onDeleteSuccess(response.data);
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error("Lỗi xoá");
      console.error(error);
    }
  };
  return (
    <Modal
      title="Tạm ngứng bán"
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

export default ModalDeleteComponent;
