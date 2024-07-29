import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import TableRequestWarranty from "../../../../sections/Warranty/RequestWarranty/RequestWarranty";

const WarrantyRequestManagent: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Yêu cầu bảo hành"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Yêu cầu bảo hành" },
        ]}
      />
      <TableRequestWarranty />
    </Container>
  );
};

export default WarrantyRequestManagent;
