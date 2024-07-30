// @mui
import { Container } from "@mui/material";
// routes
import config from "../../../configs";
// hooks
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import TableComponent from "../../../sections/MachineComponent/TableComponent";

// ----------------------------------------------------------------------

export default function MachineComponent() {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tất cả chi tiết"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Sản phẩm" },
        ]}
      />
      <TableComponent />
    </Container>
  );
}
