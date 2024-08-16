import React from "react";
//model
import { PostGetProps } from "../../../models/blog";
// form
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { ApiNews } from "../../../api/services/apiNews";
import config from "../../../configs";
//api

interface ModalNews {
  NewsData: PostGetProps | null;
  open: boolean;
  handleCLose: () => void;
  onUpdateSuccess: (text: string) => void;
}

const BlogAbleModal: React.FC<ModalNews> = ({
  NewsData,
  open,
  handleCLose,
  onUpdateSuccess,
}) => {
  const { loading, apiAbleAndTypeNews, apiDisableNews } = ApiNews();

  const onSubmit = async () => {
    try {
      if (NewsData) {
        if (NewsData.status === "Active") {
          const response = await apiDisableNews(NewsData?.id);
          if (response.status === 200) {
            if (onUpdateSuccess) {
              onUpdateSuccess(config.AdminMessageNotice.HideNews);
            } else {
              toast.error(config.AdminMessageNotice.HideNewsError);
              handleCLose();
            }
          }
        } else {
          const params = {
            type: NewsData.type,
            newsCategoryId: NewsData?.newsCategory.newsCategoryId,
            status: "Active",
          };
          const response = await apiAbleAndTypeNews(NewsData?.id, params);
          if (response.status === 200) {
            if (onUpdateSuccess) {
              onUpdateSuccess(config.AdminMessageNotice.AbleNews);
            } else {
              toast.error(config.AdminMessageNotice.AbleNewsError);
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
      title="Trạng thái bài viết"
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
      {NewsData?.status === "Active" ? (
        <Typography.Text>
          Bạn có muốn ẩn tin tức có tiêu đề: {NewsData?.title}
        </Typography.Text>
      ) : (
        <Typography.Text>
          Bạn có muốn hiển thị lại tin tức có tiêu đề: {NewsData?.title}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default BlogAbleModal;
