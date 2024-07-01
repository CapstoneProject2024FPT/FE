import React from "react";
import { Button, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { getRank } from "../../../models/rank";
import { ApiRank } from "../../../api/services/apiRank";

interface ModalRank {
  RankData: getRank | null;
  open: boolean;
  handleClose: () => void;
  onDeleteSuccess: (response: string) => void;
}

const ModalRankDelete: React.FC<ModalRank> = ({
  RankData,
  open,
  handleClose,
  onDeleteSuccess,
}) => {
  const { apiDeleteRank, loading } = ApiRank();

  const onSubmit = async () => {
    try {
      if (RankData) {
        const response = await apiDeleteRank(RankData?.id);

        if (response.status === 200) {
          onDeleteSuccess(response.data);
        } else {
          toast.error(response.Error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      title="Khả Dụng Thương Hiệu"
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
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
        Bạn có muốn xoá hạng mức: {RankData?.name}
      </Typography.Text>
    </Modal>
  );
};

export default ModalRankDelete;
