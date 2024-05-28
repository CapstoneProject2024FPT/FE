import React from "react";

import SuccessfullGif from "../../assets/gif/success-you-ve-done-it.gif";
import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../configs/routes";

const StyledButton = styled(Button)({
  backgroundColor: "#c2fbd7",
  borderRadius: "100px",
  boxShadow:
    "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px",
  color: "green",
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
      "rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px",
    transform: "scale(1.05) rotate(-1deg)",
  },
});

const PaymentSuccessfull: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "400px",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: "50px 35px",
        margin: "auto",
        transform: "translateY(50%)",
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
        Payment Successfull
      </Typography>
      <img
        src={SuccessfullGif}
        alt="loading..."
        style={{
          filter: "brightness(1.1) hue-rotate(-70deg)",
          height: "255px",
          objectFit: "none",
          zoom: "0.5",
          display: "block",
          margin: "auto",
          marginBottom: "50px",
        }}
      />

      <StyledButton onClick={() => navigate(routes.login)}>
        Back to site
      </StyledButton>
    </Box>
  );
};

export default PaymentSuccessfull;