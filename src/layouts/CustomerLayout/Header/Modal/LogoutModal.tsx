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
import { Box } from "@mui/material";
import { useCheckout } from "../../../../zustand/useCheckout";

interface LogoutProps {
  open: boolean;
  handleClose: VoidFunction;
}

export default function LogoutModal({ open, handleClose }: LogoutProps) {
  const { setAuthUser, setRole } = useAuthContext();
  const { setDiscountRank } = useCheckout();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("historyPath");
    setDiscountRank(0);
    setAuthUser(null);
    setRole(null);
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
        <Box
          sx={{
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
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
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Huỷ
            </Button>
            <Button variant="outlined" onClick={handleLogout} autoFocus>
              Đồng ý
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
