import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import SideBarUserProfile from "./SideBarUserProfile";

const FavoriteProduct: React.FC = () => {
  return (
    <>
      <Typography variant="h3" component="h2">
        Sản phẩm yêu thích
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
                  <Typography variant="h5" component="h2">
                    Sản phẩm yêu thích
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Sản phẩm 1
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Sản phẩm 2
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Sản phẩm 3
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Sản phẩm 4
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default FavoriteProduct;
