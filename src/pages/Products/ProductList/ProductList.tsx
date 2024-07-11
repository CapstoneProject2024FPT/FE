import React, { useEffect, useState } from "react";
import { ProductAdmin } from "../../../models/products";
import "./ProductList.scss";
import { Box, Button, Drawer, Typography } from "@mui/material";
import ProductCard from "../../../components/product-card/ProductCard";
import ProductFilteredRow from "../../Filter/Products/FilterProducts";
import { GridFilterListIcon } from "@mui/x-data-grid";
import { Skeleton } from "antd";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        flexDirection: "row",
        margin: "20px auto auto auto",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          borderRadius: "5px",
          width: "20%",
          minWidth: "200px",
          height: "100%",
          position: "sticky",
          top: 0,
        }}
      >
        <ProductFilteredRow setProducts={setProducts} setLoading={setLoading} />
      </Box>
      {/* filter reponsive  */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Button
          variant="outlined"
          onClick={toggleDrawer(true)}
          sx={{
            borderRadius: "5px",
            "&:hover": {
              borderColor: "#1976d2",
              borderRadius: "5px",
            },
          }}
        >
          <GridFilterListIcon
            sx={{
              "&:hover": {
                color: "#1976d2",
                backgroundColor: "unset",
                borderRadius: "none",
              },
            }}
          />
          <Typography sx={{ marginLeft: "4px" }} className="hide-text-on-small">
            Lọc
          </Typography>
        </Button>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: "250px",
              padding: "20px",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              borderRadius: "5px",
              height: "100%",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 5px grey",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            <ProductFilteredRow
              setProducts={setProducts}
              setLoading={setLoading}
            />
          </Box>
        </Drawer>
      </Box>

      {/* ---------------------------------------- */}

      <Box sx={{ width: { xs: "100%", md: "80%" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "10px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Các loại máy
            </Typography>
          </Box>
          {/* <Box sx={{ width: "50%", textAlign: "right" }}>
            <SortMenu />
          </Box> */}
        </Box>
        {loading ? (
          <Skeleton />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "25px",
              justifyContent: "space-between",
              width: "100%%",
              padding: "0 20px",
            }}
          >
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductList;
