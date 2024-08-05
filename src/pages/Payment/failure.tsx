import React from "react";

import SuccessfullGif from "../../assets/gif/failure.gif";
import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../configs/routes";

const StyledButton = styled(Button)({
  backgroundColor: "#f8d7da",
  borderRadius: "100px",
  boxShadow:
    "rgba(255, 0, 0, .2) 0 -25px 18px -14px inset,rgba(255, 0, 0, .15) 0 1px 2px,rgba(255, 0, 0, .15) 0 2px 4px,rgba(255, 0, 0, .15) 0 4px 8px,rgba(255, 0, 0, .15) 0 8px 16px,rgba(255, 0, 0, .15) 0 16px 32px",
  color: "red",
  cursor: "pointer",
  display: "inline-block",
  fontFamily: "CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif",
  padding: "7px 20px",
  textAlign: "center",
  textDecoration: "none",
  transition: "all 250ms",
  border: "0",
  fontSize: "16px",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",

  "&:hover": {
    boxShadow:
      "rgba(255, 0, 0, .35) 0 -25px 18px -14px inset,rgba(255, 0, 0, .25) 0 1px 2px,rgba(255, 0, 0, .25) 0 2px 4px,rgba(255, 0, 0, .25) 0 4px 8px,rgba(255, 0, 0, .25) 0 8px 16px,rgba(255, 0, 0, .25) 0 16px 32px",
    transform: "scale(1.05) rotate(-1deg)",
  },
});

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "400px",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: "50px 35px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: "#999",
          fontSize: "36px",
          fontWeight: "bold",
          width: "100%",
          display: "block",
        }}
      >
        Thanh Toán Thất Bại
      </Typography>
      <img
        src={SuccessfullGif}
        alt="loading..."
        style={{
          height: "255px",
          width: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />

      <StyledButton onClick={() => navigate(routes.orderManagement)}>
        Về lịch sử mua hàng
      </StyledButton>
    </Box>
  );
};

export default PaymentFailure;
