// @mui
import { Container } from "@mui/material";
// routes
// hooks
// components

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import ProductNewComponent from "../../../sections/MachineComponent/FormNewComponent";

import config from "../../../configs";

// ----------------------------------------------------------------------

export default function CreateMachineComponent() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Thêm mới chi tiết máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          {
            name: "Tất cả chi tiết máy",
            href: config.adminRoutes.viewMachineComponent,
          },
          { name: "Thêm mới chi tiết máy" },
        ]}
      />
      <ProductNewComponent />
    </Container>
  );
}
