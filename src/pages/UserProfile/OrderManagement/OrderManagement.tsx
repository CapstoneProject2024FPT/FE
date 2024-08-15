import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import WarrantyType from "./WarrantyType.tsx/WarrantyType";
import OrderType from "./OrderType/OrderType";
import { Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function OrderManagement() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch sử mua hàng
        </Typography>
        <Tabs value={value} onChange={handleChange} aria-label="Order Tabs">
          <Tab label="Mua hàng" {...a11yProps(0)} />
          <Tab label="Bảo hành" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <OrderType />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <WarrantyType />
      </CustomTabPanel>
    </Box>
  );
}
