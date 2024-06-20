import React, { useEffect, useState } from "react";
import SimpleSlider from "../../components/carousel/Carousel";
import { Box, Button, Typography } from "@mui/material";
import ShopProductHomePage from "../../sections/Shop/ShopProductHomePage";
import post from "../Home/blog.json";
import { Product } from "../../models/products";
import { PostProps } from "../../models/blog";
import BlogHomePage from "../../sections/Blog/BLogHomePage";
import { useNavigate } from "react-router-dom";
import { routes } from "../../configs/routes";
import { MachineryApi } from "../../api/services/apiMachinery";

const Home: React.FC = () => {
  const { apiGetMachineryPriority, loading, apiGetMachine } = MachineryApi();

  const [productPriority, setProductPriority] = useState<Product[]>([]);
  const [listMachine, setListMachine] = useState<Product[]>([]);

  const fetchProductPriority = async () => {
    try {
      const [machineryPriorityResult, listResult] = await Promise.allSettled([
        apiGetMachineryPriority(),
        apiGetMachine("Active"),
      ]);

      if (machineryPriorityResult.status === "fulfilled") {
        setProductPriority(machineryPriorityResult.value.data);
      } else {
        console.error(machineryPriorityResult.reason);
      }

      if (listResult.status === "fulfilled") {
        setListMachine(listResult.value.data);
      } else {
        console.error(listResult.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductPriority();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
              padding: "8px",
            }}
          >
            Sản Phẩm nổi bật
          </span>
        </Typography>
        <ShopProductHomePage products={productPriority} loading={loading} />
      </Box>
      <Box
        sx={{
          width: "100%",
          mt: 6,
          display: "flex",
          flexDirection: "column",
        }}
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
              padding: "8px",
            }}
          >
            Các Loại Máy Khác
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
        <ShopProductHomePage products={listMachine} loading={loading} />
      </Box>
      <Box sx={{ width: "100%", mt: 6 }}>
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
              padding: "8px",
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
