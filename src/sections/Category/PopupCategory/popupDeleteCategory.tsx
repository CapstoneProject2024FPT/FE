import React from "react";
//model
import { GetCategoryProps } from "../../../models/category";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { CategoryApi } from "../../../api/services/apiCategories";

interface ModalCategory {
  CategoryData: GetCategoryProps | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
}

const ModalCategoryPopupDelete: React.FC<ModalCategory> = ({
  CategoryData,
  openDeletePopup,
  handleCLoseDelete,
}) => {
  const { loading, deleteCategory } = CategoryApi();

  const onSubmit = async () => {
    try {
      if (CategoryData) {
        const response = await deleteCategory(CategoryData?.id);
        console.log(response);
      }
      toast.success("postSuccess");
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
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <Typography.Text>
        Bạn có muốn xoá loại máy tên: {CategoryData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalCategoryPopupDelete;
