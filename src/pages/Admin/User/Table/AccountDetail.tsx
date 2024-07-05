import * as React from "react";
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import config from "../../../../configs";
import AccountInfo from "./Account/AccountInfo";

const AccountDetail: React.FC = () => {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Tài Khoản"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Tài khoản", href: config.adminRoutes.user },
          { name: "Chi tiết tài khoản" },
        ]}
      />
      <AccountInfo />
    </Container>
  );
};

export default AccountDetail;
