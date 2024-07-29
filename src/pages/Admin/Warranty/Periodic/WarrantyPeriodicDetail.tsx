import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import PeriodicWarrantyDetail from "../../../../sections/Warranty/PeriodicWarranty/PeriodicWarrantyDetail";

const WarrantyPeriodicDetail: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Chi tiết yêu cầu bảo hành"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          {
            name: "Bảo trì định kì",
            href: config.adminRoutes.maintenance,
          },
          { name: "Chi tiết " },
        ]}
      />
      <PeriodicWarrantyDetail />
    </Container>
  );
};

export default WarrantyPeriodicDetail;
