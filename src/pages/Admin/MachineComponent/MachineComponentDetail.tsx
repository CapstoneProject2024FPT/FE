// @mui
import { Container } from "@mui/material";
// routes
import config from "../../../configs";
// hooks
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import ProductComponentDetail from "../../../sections/MachineComponent/MachineComponentDetail";

// ----------------------------------------------------------------------

export default function MachineComponentDetail() {
  return (
    <Container style={{ width: "100%", maxWidth: "none" }}>
      <HeaderBreadcrumbs
        heading="Chi tiết bộ phận"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          {
            name: "Chi tiết máy",
            href: config.adminRoutes.viewMachineComponent,
          },
          { name: "Chi tiêt sản phẩm" },
        ]}
      />
      <ProductComponentDetail />
    </Container>
  );
}
