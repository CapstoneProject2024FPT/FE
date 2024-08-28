import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import PeriodicWarrantyDetail from "../../../../sections/Warranty/PeriodicWarranty/PeriodicWarrantyDetail";

const WarrantyPeriodicDetail: React.FC = () => {
  return (
    <Container style={{ width: "100%", maxWidth: "none" }}>
      <HeaderBreadcrumbs
        heading="Chi tiết bảo hành định kỳ"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          {
            name: "Bảo hành định kỳ",
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
