// @mui
import { Box, Card, Typography, Stack } from "@mui/material";

// utils
import { formatMoney } from "../../utils/fn";
// @types
import { Product } from "../../models/products";
// components
import { Link } from "react-router-dom";
import Image from "../Image";
import config from "../../configs";

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { name, sellingPrice, image, origin, id } = product;

  return (
    <Link
      to={config.routes.productDetail.replace(config.suffix.detailId, id)}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "5px",
          width: "100%",
          height: "100%",
          color: "black",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          cursor: "pointer",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Image alt={name} src={image[0].imageURL} width="100" height="100" />
        </Box>

        <Stack spacing={1} sx={{ p: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="subtitle1">Xuất xứ: {origin.name}</Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={0.5}>
              {/* {salePrice && (
              <Typography
                component="span"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                {formatMoney(salePrice)}
              </Typography>
            )} */}

              <Typography variant="subtitle1">
                {formatMoney(sellingPrice)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}
