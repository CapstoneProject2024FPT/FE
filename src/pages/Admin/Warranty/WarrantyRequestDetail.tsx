import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import RequestDetail from "../../../sections/Warranty/RequestWarranty/RequestDetail";

const WarrantyRequestDetail: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Chi tiết yêu cầu bảo hành"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tất cả bảo trì", href: config.adminRoutes.maintenance },
          { name: "Chi tiết yêu cầu bảo hành" },
        ]}
      />
      <RequestDetail />
    </Container>
  );
};

export default WarrantyRequestDetail;
