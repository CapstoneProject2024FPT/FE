import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Container, Tabs, Tab } from "@mui/material";
import SideBarUserProfile from "./SideBar/SideBarUserProfile";
import WarrantyManagement from "./Warranty/WarrantyManagement";
import WarrantyRequests from "./Warranty/WarrantyRequests";

const Warranty: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);



  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Container
        maxWidth={false}
        style={{
          backgroundColor: "#ECF0F1",
        }}
      >
        <Box sx={{ flexGrow: 1, margin: "2%", padding: "20px" }}>
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
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Yêu cầu bảo hành" />
                    <Tab label="Quản lý bảo hành" />
                  </Tabs>
                  {tabValue === 0 && <WarrantyManagement />}
                  {tabValue === 1 && <WarrantyRequests />}
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Warranty;
