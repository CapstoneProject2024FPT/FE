import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../../../configs";

interface LogoutProps {
  open: boolean;
  handleClose: VoidFunction;
}

export default function LogoutModal({ open, handleClose }: LogoutProps) {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("historyPath");
    setAuthUser(null);
    setTimeout(() => {
      navigate(config.routes.home);
    }, 500);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
          Đăng xuất
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có muốn đăng xuất?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleLogout} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
