import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import SideBarUserProfile from "./SideBar/SideBarUserProfile";
import Profile from "./Profile/Profile";

const UserProfile: React.FC = () => {
  return (
    <>
      <Typography variant="h3" component="h2">
        Trang cá nhân
      </Typography>
      <div
        style={{
          backgroundColor: "#ECF0F1",
          borderRadius: "20px",
          width: "80%",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1, margin: "2%", padding: "20px" }}>
          <Grid container spacing={2}>
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
                  <Grid container spacing={2}>
                    <Profile />
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default UserProfile;
