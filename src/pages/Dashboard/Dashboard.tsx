/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { ApiAdminDashboard } from "../../api/services/apiAdminDashboard";
import { DashboardProp } from "../../models/dashboard";
import { AttachMoney, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import EmptyData from "../../components/EmptyData";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS = ["#2980b9", "#27ae60", "#e74c3c", "#f1c40f", "#f0932b"];
const years = [2025 ,2024, 2023];
const Dashboard: React.FC = () => {
  const { apiGetData } = ApiAdminDashboard();
  const [dashboardData, setDashboardData] = useState<DashboardProp>();
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Default year

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await apiGetData(selectedYear.toString());
      console.log(response.data);
      setDashboardData(response.data);
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const hasData = (data: any) => {
    return data && data.totalOrders && data.totalOrders > 0;
  };

  const dataPie = [
    { name: "Đã thanh toán", value: dashboardData?.ordersByStatus.Paid },
    { name: "Đã hủy thanh toán", value: dashboardData?.ordersByStatus.UnPaid },
    { name: "Đã hoàn thành", value: dashboardData?.ordersByStatus.Completed },
    { name: "Đã hủy đơn hàng", value: dashboardData?.ordersByStatus.Canceled },
    { name: "Đã vận chuyển", value: dashboardData?.ordersByStatus.Deliver },
  ].filter(({ value }) => !!value);

  const totalOrdersArray = dashboardData?.monthlyStatistics.map((item) => ({
    month: `Tháng ${item.month}`,
    totalOrders: item.totalOrders,
  }));

  const totalProfitAndTotalRevenue = dashboardData?.monthlyStatistics.map(
    (item) => ({
      month: `Tháng ${item.month}`,
      totalProfit: item.totalProfit,
      totalRevenue: item.totalRevenue,
    })
  );

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
  };
  const formatOrder = (value: any) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " Đơn";
  };

  const CustomTooltipBarChart1 = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p className="label">{`Tháng ${label}`}</p>
          <p className="intro">{`Tổng đơn: ${formatOrder(
            payload[0].value
          )}`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipBarChart2 = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p className="label">{`Tháng ${label}`}</p>
          <p className="intro">{`Lợi nhuận: ${formatCurrency(
            payload[0].value
          )}`}</p>
          <p className="intro">{`Doanh thu: ${formatCurrency(
            payload[1].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomXAxisTickBarChart1 = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom YAxisTick formatter function
  const formatYAxisTick = (value: any) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value;
  };

  // Custom XAxisTick formatter function
  const CustomXAxisTickBarChart2 = ({ x, y, payload }: any) => {
    return (
      <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    );
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box         sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <HeaderBreadcrumbs
          heading="Thống kê"
          links={[{ name: "Thống kê" }, { name: "Thống kê doanh thu" }]}
        />

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel>Năm</InputLabel>
          <Select
            label="Năm"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {!hasData(dashboardData) ? (
        <EmptyData
        style={{
          display: "flex",
          alignItems: 'center',
          justifyContent: "unset"
        }}
          title="Chưa có dữ liệu sẵn có"
        />
      ) : (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "20px",
          }}
        >
          <Card
            sx={{
              width: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              background: "#4caf50",
              color: "#fff",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ShoppingCart sx={{ fontSize: 40, color: "#fff" }} />
                <Typography sx={{ fontSize: 18, color: "#fff" }}>
                  Tổng số đơn hàng
                </Typography>
                <Typography gutterBottom variant="h6">
                  {formatOrder(dashboardData?.totalOrders)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              width: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              background: "#ff9800",
              color: "#fff",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <AttachMoney sx={{ fontSize: 40, color: "#fff" }} />
                <Typography sx={{ fontSize: 18, color: "#fff" }}>
                  Tổng lợi nhuận
                </Typography>
                <Typography gutterBottom variant="h6">
                  {formatCurrency(dashboardData?.totalProfit)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              width: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              background: "#f44336",
              color: "#fff",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <MonetizationOn sx={{ fontSize: 40, color: "#fff" }} />
                <Typography sx={{ fontSize: 18, color: "#fff" }}>
                  Tổng doanh thu
                </Typography>
                <Typography gutterBottom variant="h6">
                  {formatCurrency(dashboardData?.totalRevenue)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ margin: "10px", border: "1px solid #d9d9d9" }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "20px",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={totalOrdersArray}
                barSize="3%"
                barGap="6"
                barCategoryGap="3%"
              >
                <CartesianGrid />
                <XAxis
                  dataKey="month"
                  tick={<CustomXAxisTickBarChart1 />}
                  interval={0}
                  padding={{ left: 25, right: 25 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltipBarChart1 />} />
                <Legend
                  payload={[
                    {
                      value: "Đơn hàng",
                      type: "square",
                      color: "#4caf50",
                    },
                  ]}
                  wrapperStyle={{
                    marginTop: "10px",
                    position: "relative",
                    fontSize: "14px",
                  }}
                />
                <Bar dataKey="totalOrders" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: "5px", border: "1px solid #d9d9d9" }}
          />
          <Box sx={{ width: "40%" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataPie}
                  outerRadius={120}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataPie.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Divider
          orientation="horizontal"
          flexItem
          sx={{ margin: "40px 0 20px", border: "1px solid #d9d9d9" }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ResponsiveContainer width={1000} height={400}>
            <BarChart
              data={totalProfitAndTotalRevenue}
              barSize="3%"
              barGap="6"
              barCategoryGap="3%"
            >
              <CartesianGrid />
              <XAxis
                dataKey="month"
                tick={<CustomXAxisTickBarChart2 />}
                interval={0}
                padding={{ left: 25, right: 25 }}
              />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip content={<CustomTooltipBarChart2 />} />
              <Legend
                payload={[
                  {
                    value: "Lợi nhuận",
                    type: "square",
                    color: "#ff9800",
                  },
                  {
                    value: "Doanh thu",
                    type: "square",
                    color: "#f44336",
                  },
                ]}
                wrapperStyle={{
                  position: "relative",
                  fontSize: "16px",
                }}
              />
              <Bar dataKey="totalProfit" fill="#ff9800" />
              <Bar dataKey="totalRevenue" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      )}
    </Box>
  );
};

export default Dashboard;
