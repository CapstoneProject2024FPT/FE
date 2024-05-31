// @mui
import { Box, Card, Link, Typography, Stack } from "@mui/material";

// utils
import { formatMoney } from "../../utils/fn";
// @types
import { Product } from "../../models/products";
// components

import Image from "../Image";

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { name, price, image, salePrice } = product;

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <Image alt={name} src={image} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={0.5}>
            {salePrice && (
              <Typography
                component="span"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                {formatMoney(salePrice)}
              </Typography>
            )}

            <Typography variant="subtitle1">{formatMoney(price)}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
