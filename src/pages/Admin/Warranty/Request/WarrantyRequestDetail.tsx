import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import RequestDetail from "../../../../sections/Warranty/RequestWarranty/RequestDetail";

const WarrantyRequestDetail: React.FC = () => {
  return (
    <Container style={{ width: "100%", maxWidth: "none" }}>
      <HeaderBreadcrumbs
        heading="Chi tiết yêu cầu bảo hành"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          {
            name: "Yêu cầu bảo hành",
            href: config.adminRoutes.maintenanceRequest,
          },
          { name: "Chi tiết yêu cầu bảo hành" },
        ]}
      />
      <RequestDetail />
    </Container>
  );
};

export default WarrantyRequestDetail;
