import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Container } from "@mui/material";
import SideBarUserProfile from "./SideBar/SideBarUserProfile";
import Transaction from "./Transaction/Transaction";

const UserTransaction: React.FC = () => {
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
                    boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    borderRadius: "10px",
                  }}
                >
                  <Transaction />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default UserTransaction;
