import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Container } from "@mui/material";
import SideBarUserProfile from "./SideBar/SideBarUserProfile";
import OrderManagement from "./OrderManagement/OrderManagement";

const OrderCustomer: React.FC = () => {
  return (
    <>

      <Container
        maxWidth={false}
        style={{
          backgroundColor: "#ECF0F1",
        }}
      >
        <Box sx={{ flexGrow: 1, margin: "2%" }}>
          <Grid container spacing={1}>
            <Grid xs={12} md={3}>
              <SideBarUserProfile />
            </Grid>
            <Grid xs={12} md={9}>
              <Box sx={{ marginLeft: "5%" }}>
                <Paper
                  sx={{
                    borderStyle: "none",
                    padding: "20px",
                    border: "1px solid ",
                  }}
                >
                  <OrderManagement />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default OrderCustomer;
