import React from "react";
//model
import { brandTable } from "../../../models/brand";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { BrandApi } from "../../../api/services/apiBrand";
import config from "../../../configs";
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
  const { loading, deleteBrand, updateActiveBrand } = BrandApi();

  const onSubmit = async () => {
    try {
      if (BrandData?.status === "Active") {
        const response = await deleteBrand(BrandData?.id);
        if (onDeleteSuccess) {
          onDeleteSuccess(response);
        }
      } else {
        if (BrandData) {
          const params = {
            status: "Active",
          };
          const response = await updateActiveBrand(BrandData?.id, params);
          if (onDeleteSuccess) {
            onDeleteSuccess(response);
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
      title="Xoá thương hiệu"
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
      {BrandData?.status === "Active" && (
        <Typography.Text>
          Bạn có muốn xoá thương hiệu máy tên: {BrandData?.name}
        </Typography.Text>
      )}
      {BrandData?.status === "Inactive" && (
        <Typography.Text>
          Bạn có muốn mở lại thương hiệu máy tên: {BrandData?.name}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ModalBrandPopupDelete;
