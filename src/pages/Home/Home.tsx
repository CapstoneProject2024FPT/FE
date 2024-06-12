import React from "react";
import SimpleSlider from "../../components/carousel/Carousel";
import { Box, Typography } from "@mui/material";
import ShopProductHomePage from "../../sections/Shop/ShopProductHomePage";
import product from "../Home/product.json";
import post from "../Home/blog.json";
import { ProductProps } from "../../models/products";
import { PostProps } from "../../models/blog";
import BlogHomePage from "../../sections/Blog/BLogHomePage";

const Home: React.FC = () => {
  const productNow: ProductProps = product as ProductProps;
  const New: PostProps = post as PostProps;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
      }}
    >
      <SimpleSlider />
      <Box sx={{ width: "100%", mt: 4 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            fontSize: "22px",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "calc(50% - 2px)",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              paddingRight: "1.071429rem",
              background: "#fff",
            }}
          >
            Sản Phẩm nổi bật
          </span>
        </Typography>
        <ShopProductHomePage
          products={productNow}
          loading={!productNow.length}
        />
      </Box>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            fontSize: "22px",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "calc(50% - 2px)",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              paddingRight: "1.071429rem",
              background: "#fff",
            }}
          >
            Danh mục máy
          </span>
        </Typography>
        <ShopProductHomePage
          products={productNow}
          loading={!productNow.length}
        />
      </Box>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            fontSize: "22px",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "calc(50% - 2px)",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              paddingRight: "1.071429rem",
              background: "#fff",
            }}
          >
            Tin Tức
          </span>
        </Typography>
        <BlogHomePage posts={New} loading={!New.length} />
      </Box>
    </div>
  );
};

export default Home;
