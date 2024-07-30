import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import TablePeriodicWarranty from "../../../../sections/Warranty/PeriodicWarranty/PeriodicWarranty";

const WarrantyManagent: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Bảo trì định kì"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Bảo trì định kì" },
        ]}
      />
      <TablePeriodicWarranty />
    </Container>
  );
};

export default WarrantyManagent;
