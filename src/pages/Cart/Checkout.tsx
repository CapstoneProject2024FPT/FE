import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  Container,
} from "@mui/material";
import Iconify from "../../components/Iconify";
import Cart from "./CartSection/Cart";

const STEPS = ["Giỏ hàng", "Hoá đơn và địa chỉ", "Thanh Toán"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface QontoStepIconProps {
  active?: boolean;
  completed?: boolean;
}
const QontoStepIcon: React.FC<QontoStepIconProps> = ({
  active = false,
  completed = false,
}) => {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "primary.main" : "text.disabled",
      }}
    >
      {completed ? (
        <Iconify
          icon={"eva:checkmark-fill"}
          sx={{ zIndex: 1, width: 20, height: 20, color: "primary.main" }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Box>
  );
};
//----------------------------
const Checkout: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  console.log(activeStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const isComplete = activeStep === STEPS.length;
  return (
    <>
      <Container maxWidth="xl">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<QontoConnector />}
            >
              {STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      "& .MuiStepLabel-label": {
                        typography: "subtitle2",
                        color:
                          index === activeStep
                            ? "primary.main"
                            : "text.disabled",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
        {!isComplete ? (
          <>{activeStep === 0 && <Cart handleNext={handleNext} />}</>
        ) : (
          "thanh toán xong"
        )}
      </Container>
    </>
  );
};

export default Checkout;
