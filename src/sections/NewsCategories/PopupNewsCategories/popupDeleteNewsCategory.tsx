import React from "react";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
//api
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
//model
import { NewsCategoryProps } from "../../../models/newCategories";

interface ModalCategory {
  NewsCategoryData: NewsCategoryProps | null;
  openDeletePopup: boolean;
  handleCLoseDelete: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalNewsCategoryPopupDelete: React.FC<ModalCategory> = ({
  NewsCategoryData,
  openDeletePopup,
  handleCLoseDelete,
  onDeleteSuccess,
}) => {
  const { loading, deleteNewsCategories, updateNewsCategory } =
    ApiNewsCategories();

  const onSubmit = async () => {
    try {
      if (NewsCategoryData) {
        if (NewsCategoryData.status === "Active") {
          const response = await deleteNewsCategories(NewsCategoryData?.id);
          if (response.status === 200) {
            if (onDeleteSuccess) {
              onDeleteSuccess(response.data);
              handleCLoseDelete();
            }
          } else {
            handleCLoseDelete();
            toast.error(response.Error);
          }
        } else {
          const param = {
            name: NewsCategoryData.name,
            description: NewsCategoryData.description,
            status: "Active",
          };
          const response = await updateNewsCategory(
            NewsCategoryData?.id,
            param
          );

          if (response.status === 200) {
            if (onDeleteSuccess) {
              onDeleteSuccess(response.data);
            }
          } else {
            toast.error("Có lỗi trong quá trình cập nhật");
          }
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
      {NewsCategoryData?.status === "Active" ? (
        <Typography.Text>
          Bạn có muốn tắt khả dụng loại tin tức tên: {NewsCategoryData?.name}
        </Typography.Text>
      ) : (
        <Typography.Text>
          Bạn có muốn mở khả dụng loại tin tức tên: {NewsCategoryData?.name}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ModalNewsCategoryPopupDelete;
