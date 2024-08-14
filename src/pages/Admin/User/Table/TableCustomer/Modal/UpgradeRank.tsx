import React from "react";
import { Modal, Button } from "antd";
import { userModel } from "../../../../../../models/UserData";
import { getRank } from "../../../../../../models/rank";
import { ApiAccount } from "../../../../../../api/services/apiAccount";
import { toast } from "react-toastify";

interface RankUpgradePopupProps {
  open: boolean;
  onClose: () => void;
  rank: getRank | undefined;
  accountId: userModel | undefined;
  onUpdateSuccess: () => void;
}

const RankUpgradePopup: React.FC<RankUpgradePopupProps> = ({
  open,
  onClose,
  rank,
  accountId,
  onUpdateSuccess,
}) => {
  const { apiRankUpgrade } = ApiAccount();

  const handleRankUpgrade = async () => {
    if (accountId && rank) {
      const userId = accountId.id;
      const rankIds = [rank.id];
      try {
        const result = await apiRankUpgrade(userId, rankIds);
        if (result.status === 200) {
          onUpdateSuccess();
        } else {
          toast.error(result.Error);
        }
      } catch (error) {
        console.error("Failed to upgrade rank:", error);
      }
      onClose();
    }
  };

  return (
    <Modal
      title="Thăng hạng"
      onCancel={onClose}
      open={open}
      footer={[
        <Button key="back" onClick={onClose}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleRankUpgrade}>
          Tăng hạng
        </Button>,
      ]}
    >
      <p>Khách hàng: {accountId?.fullName}</p>
      <p>Hạng có thể lên: {rank?.name}</p>
    </Modal>
  );
};

export default RankUpgradePopup;
