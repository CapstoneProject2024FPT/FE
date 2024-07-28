import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableWarranty from "../../../sections/Warranty/TableWarranty";

const WarrantyManagent: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tất cả bảo trì"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Bảo trì" },
        ]}
      />
      <TableWarranty />
    </Container>
  );
};

export default WarrantyManagent;
