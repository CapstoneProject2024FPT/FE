import React from "react";
//model
import { PostGetProps } from "../../../models/blog";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { ApiNews } from "../../../api/services/apiNews";
//api

interface ModalNews {
  NewsData: PostGetProps | null;
  open: boolean;
  handleCLose: () => void;
  onUpdateSuccess: (text: string) => void;
}

const BlogHotModal: React.FC<ModalNews> = ({
  NewsData,
  open,
  handleCLose,
  onUpdateSuccess,
}) => {
  const { loading, apiAbleAndTypeNews } = ApiNews();

  const onSubmit = async () => {
    try {
      if (NewsData) {
        if (NewsData.type === "Hot") {
          const params = {
            type: "Normal",
            newsCategoryId: NewsData?.newsCategory.newsCategoryId,
            status: NewsData.status,
          };
          const response = await apiAbleAndTypeNews(NewsData?.id, params);
          if (response.status === 200) {
            if (onUpdateSuccess) {
              onUpdateSuccess("Ẩn tin tức thành công");
            } else {
              toast.error("Gặp lỗi trong quá trình ẩn tin tức");
              handleCLose();
            }
          }
        } else {
          const params = {
            type: "Hot",
            newsCategoryId: NewsData?.newsCategory.newsCategoryId,
            status: NewsData.status,
          };
          const response = await apiAbleAndTypeNews(NewsData?.id, params);
          if (response.status === 200) {
            if (onUpdateSuccess) {
              onUpdateSuccess("Ẩn tin tức thành công");
            } else {
              toast.error("Gặp lỗi trong quá trình ẩn tin tức");
              handleCLose();
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      handleCLose();
    }
  };
  return (
    <Modal
      title="Hạng Mức"
      open={open}
      onOk={handleCLose}
      onCancel={handleCLose}
      footer={[
        <Button key="back" onClick={handleCLose}>
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
      {NewsData?.type === "Normal" ? (
        <Typography.Text>
          Bạn có muốn chỉnh tin tức có tiêu đề: {NewsData?.title} thành tin nóng
        </Typography.Text>
      ) : (
        <Typography.Text>
          Bạn có muốn chỉnh tin tức có tiêu đề: {NewsData?.title} về bình thường
        </Typography.Text>
      )}
    </Modal>
  );
};

export default BlogHotModal;
