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
    <Container>
      <HeaderBreadcrumbs
        heading="Thêm mới sản phẩm"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm" },
          { name: "Thêm mới sản phẩm" },
        ]}
      />
      <FormNewProduct />
    </Container>
  );
}
