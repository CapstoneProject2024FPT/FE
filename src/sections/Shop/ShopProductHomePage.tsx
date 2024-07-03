// @mui
import { Box } from "@mui/material";
// @type
import { Product } from "../../models/products";

import { SkeletonProductItem } from "../../components/skeleton";
import ProductCard from "../../components/product-card/ProductCard";

// ----------------------------------------------------------------------

type Props = {
  products: Product[];
  loading: boolean;
};

export default function ShopProductHomePage({ products, loading }: Props) {
  const displayedProducts: (Product | undefined)[] = loading
    ? Array(4).fill(undefined)
    : products?.slice(0, 4);
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "5px",
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 1,
      }}
    >
      {displayedProducts?.map((product, index) =>
        product ? (
          <ProductCard key={product.id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
