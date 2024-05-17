import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface LoginSnackBar {
  open: boolean;
  text: string;
  handleClose: () => void;
}
const LoginSnackbar: React.FC<LoginSnackBar> = ({
  handleClose,
  open,
  text,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={handleClose}
      autoHideDuration={2800}
    >
      <Alert severity="error" variant="filled">
        {text ? text : "login fail"}
      </Alert>
    </Snackbar>
  );
};

export default LoginSnackbar;
