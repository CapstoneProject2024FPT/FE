import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TableRank from "../../../sections/Rank/TableRank";

const Rank: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tất cả loại máy"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Hạng" },
        ]}
      />
      <TableRank />
    </Container>
  );
};

export default Rank;
