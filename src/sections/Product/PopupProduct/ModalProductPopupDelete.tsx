import React from "react";
//model

// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ProductAdmin } from "../../../models/products";
import { MachineryApi } from "../../../api/services/apiMachinery";
import config from "../../../configs";

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
  const { loading, apiDeleteMachine, apiUpdateStatus } = MachineryApi();

  const onSubmit = async () => {
    try {
      if (ProductData) {
        if (ProductData.status === "Available") {
          const response = await apiDeleteMachine(ProductData?.id);

          if (response.status === 200) {
            if (onDeleteSuccess) {
              onDeleteSuccess(response.data);
            }
          } else {
            toast.error(response.Error);
          }
        } else {
          const params = {
            status: "Available",
          };
          const response = await apiUpdateStatus(ProductData?.id, params);

          if (response.status === 200) {
            if (onDeleteSuccess) {
              onDeleteSuccess(response.data);
            }
          } else {
            toast.error(response.Error);
          }
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorDelete);
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
      {ProductData?.status === "Available" ? (
        <Typography.Text>
          Bạn có muốn ngưng bán loại máy tên: {ProductData?.name}
        </Typography.Text>
      ) : (
        <Typography.Text>
          Bạn có muốn bán lại máy tên: {ProductData?.name}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ModalProductPopupDelete;
