// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import ProductDetail from "../../../sections/Product/ProductDetail";

import config from "../../../configs";

// ----------------------------------------------------------------------

export default function ViewProductDetail() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Chi tiết sản phẩm"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm", href: config.adminRoutes.product },
          { name: "Chi tiết sản phẩm" },
        ]}
      />
      <ProductDetail />
    </Container>
  );
}
