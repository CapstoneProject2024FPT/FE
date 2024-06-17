import React from "react";
import SimpleSlider from "../../components/carousel/Carousel";
import { Box, Button, Typography } from "@mui/material";
import ShopProductHomePage from "../../sections/Shop/ShopProductHomePage";
import product from "../Home/product.json";
import post from "../Home/blog.json";
import { ProductProps } from "../../models/products";
import { PostProps } from "../../models/blog";
import BlogHomePage from "../../sections/Blog/BLogHomePage";
import { useNavigate } from "react-router-dom";
import { routes } from "../../configs/routes";

const Home: React.FC = () => {
  const productNow: ProductProps = product as ProductProps;
  const New: PostProps = post as PostProps;
  const navigate = useNavigate();
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
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "50%",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              background: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "8px"
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
      <Box
        sx={{ width: "100%", mt: 4, display: "flex", flexDirection: "column" }}
      >
        <Typography
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "50%",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              background: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "8px"
            }}
          >
            Danh mục máy
          </span>
        </Typography>
        <Button
          sx={{
            color: "grey",
            border: "1px solid",
            borderRadius: "10px",
            alignSelf: "flex-end",
            textTransform: "uppercase",
            "&:hover": {
              color: "blue",
            },
          }}
          onClick={() => navigate(routes.productList)}
        >
          Xem tất cả
        </Button>
        <ShopProductHomePage
          products={productNow}
          loading={!productNow.length}
        />
      </Box>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Typography
          component="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "500",
            position: "relative",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
              background: "rgba(0, 0, 0, .1)",
              top: "50%",
            },
          }}
        >
          <span
            style={{
              position: "relative",
              background: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "8px"
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
