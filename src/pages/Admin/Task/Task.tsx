import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableTask from "../../../sections/Task/TableTask";

const KanBan: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả nhiệm vụ"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Nhiệm vụ" },
        ]}
      />
      <TableTask />
    </Container>
  );
};

export default KanBan;
