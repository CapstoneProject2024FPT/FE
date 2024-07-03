import React from "react";
import { Typography } from "@mui/material";

const Favorite: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Favorite;
