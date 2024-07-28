// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import FormNewProduct from "../../../sections/Product/FormNewProduct";

import config from "../../../configs";

// ----------------------------------------------------------------------

export default function CreateProduct() {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Thêm mới máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm", href: config.adminRoutes.product },
          { name: "Thêm mới máy" },
        ]}
      />
      <FormNewProduct />
    </Container>
  );
}
