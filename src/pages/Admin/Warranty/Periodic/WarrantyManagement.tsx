import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import TablePeriodicWarranty from "../../../../sections/Warranty/PeriodicWarranty/PeriodicWarranty";

const WarrantyManagent: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Bảo hành định kỳ"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Bảo hành định kỳ" },
        ]}
      />
      <TablePeriodicWarranty />
    </Container>
  );
};

export default WarrantyManagent;
