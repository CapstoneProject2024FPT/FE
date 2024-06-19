// @mui
import { Container, Tab, Box, Tabs } from "@mui/material";
// routes

// hooks
import useTabs from "../../../hooks/useTabs";
// components
import Iconify from "../../../components/Iconify";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import {
  AccountGeneral,
  AccountChangePassword,
} from "../../../sections/user/account";
import config from "../../../configs";

// ----------------------------------------------------------------------

export default function ProfileAccount() {
  const { currentTab, onChangeTab } = useTabs("Thông tin cá nhân");

  const ACCOUNT_TABS = [
    {
      value: "Thông tin cá nhân",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: "Đổi mật Khẩu",
      icon: <Iconify icon={"ic:round-vpn-key"} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Account"
        links={[
          { name: "Thống kê", href: config.adminRoutes.dashboard },
          { name: "Điều chỉnh thông tin cá nhân" },
        ]}
      />

      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={currentTab}
        onChange={onChangeTab}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            label={tab.value}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}
