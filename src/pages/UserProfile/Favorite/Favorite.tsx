import React from "react";
import { Typography, Container } from "@mui/material";


const Favorite: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
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
    </Container>
  );
};

export default Favorite;
