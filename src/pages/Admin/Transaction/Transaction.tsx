import { Container } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import config from "../../../configs";
import TransactionTable from "../../../sections/Transaction/Transaction";

const TransactionAdmin: React.FC = () => {
  return (
    <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
      <HeaderBreadcrumbs
        heading="Tất cả giao dịch"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Giao dịch" },
        ]}
      />
      <TransactionTable />
    </Container>
  );
};

export default TransactionAdmin;
