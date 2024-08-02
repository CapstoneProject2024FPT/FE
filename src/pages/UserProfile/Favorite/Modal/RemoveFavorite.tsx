import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FavoriteMachine } from "../../../../models/favourite";
import { ApiFavourite } from "../../../../api/services/apiFavourite";
import config from "../../../../configs";
import { toast } from "react-toastify";

interface RemoveFavoriteProps {
  open: boolean;
  onClose: () => void;
  onSuccess: VoidFunction;
  favoriteList: FavoriteMachine | undefined;
}

const RemoveFavorite: React.FC<RemoveFavoriteProps> = ({
  open,
  onClose,
  onSuccess,
  favoriteList,
}) => {
  const { apiDeleteFavourite, loading } = ApiFavourite();

  const onSubmit = async () => {
    if (favoriteList) {
      const response = await apiDeleteFavourite(favoriteList.id);
      if (response.status === 200) {
        if (onSuccess) onSuccess();
      } else {
        toast.error(config.MessageNotice.FavouriteFailed);
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bỏ yêu thích</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn bỏ máy tên {favoriteList?.name} ra khỏi danh sách yêu
          thích ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={loading}
            onClick={() => onSubmit()}
            sx={{ mr: 2 }}
          >
            Xác nhận
          </LoadingButton>
          <Button onClick={onClose} color="primary" variant="contained">
            Hủy
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveFavorite;
