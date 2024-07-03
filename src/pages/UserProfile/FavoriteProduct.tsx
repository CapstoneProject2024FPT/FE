import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Container, Typography } from "@mui/material";
import SideBarUserProfile from "./SideBar/SideBarUserProfile";
import Favorite from "./Favorite/Favorite";

const FavoriteProduct: React.FC = () => {
  return (
    <>
      <Typography variant="h3" component="h2">
        Sản phẩm yêu thích
      </Typography>
      <Container
        maxWidth="lg"
        style={{
          backgroundColor: "#ECF0F1",
          borderRadius: "20px",
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
                  <Favorite />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default FavoriteProduct;
