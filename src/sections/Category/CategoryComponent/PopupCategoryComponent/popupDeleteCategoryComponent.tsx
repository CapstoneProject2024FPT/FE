import React from "react";
//model
import { GetCategoryProps } from "../../../../models/category";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { CategoryApi } from "../../../../api/services/apiCategories";
import config from "../../../../configs";

interface ModalCategory {
  CategoryData: GetCategoryProps | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalCategoryPopupDeleteComponent: React.FC<ModalCategory> = ({
  CategoryData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, deleteCategory } = CategoryApi();

  const onSubmit = async () => {
    try {
      if (CategoryData) {
        const response = await deleteCategory(CategoryData?.id);
        if (response.status === 200) {
          if (onDeleteSuccess) {
            onDeleteSuccess(response.data);
          }
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorDelete);
      console.error(error);
    }
  };
  return (
    <Modal
      title="Xoá Loại Máy"
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
        Bạn có muốn xoá loại máy tên: {CategoryData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalCategoryPopupDeleteComponent;
