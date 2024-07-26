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
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { ApiAdminDashboard } from "../../api/services/apiAdminDashboard";
import { DashboardProp } from "../../models/dashboard";

// const data = [
//   { name: "Tháng 1", value: 2400 },
//   { name: "Tháng 2", value: 1398 },
//   { name: "Tháng 3", value: 9800 },
//   { name: "Tháng 4", value: 3908 },
//   { name: "Tháng 5", value: 4800 },
//   { name: "Tháng 6", value: 3800 },
//   { name: "Tháng 7", value: 4300 },
//   { name: "Tháng 8", value: 9800 },
//   { name: "Tháng 9", value: 3908 },
//   { name: "Tháng 10", value: 4800 },
//   { name: "Tháng 11", value: 3800 },
//   { name: "Tháng 12", value: 4300 },
// ];

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

const Dashboard: React.FC = () => {
  const { apiGetData } = ApiAdminDashboard();
  // const [total, setTotal] = useState(0);
  // const [dataPie, setDataPie] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardProp>();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await apiGetData("2024");
      console.log(response.data);
      setDashboardData(response.data);
      // const paid = response?.data?.ordersByStatus.Paid || 0;
      // const unPaid = response?.data?.ordersByStatus.UnPaid || 0;
      // const completed = response?.data?.ordersByStatus.Completed || 0;
      // const canceled = response?.data?.ordersByStatus.Canceled || 0;
      // const deliver = response?.data?.ordersByStatus.Deliver || 0;
      // setTotal(paid + unPaid + completed + canceled + deliver);

      // setDataPie(
      //   [
      //     { name: "Đã thanh toán", value: paid },
      //     {
      //       name: "Đã hủy thanh toán",
      //       value: unPaid,
      //     },
      //     {
      //       name: "Đã hoàn thành",
      //       value: completed,
      //     },
      //     {
      //       name: "Đã hủy đơn hàng",
      //       value: canceled,
      //     },
      //     { name: "Đã vận chuyển", value: deliver },
      //   ].filter(({ value }) => value !== 0)

      return response.data;
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const CustomTooltip2 = ({ active, payload, label }: any) => {
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
          <p className="intro">{`Lợi nhuận: ${payload[0].value}`}</p>
          <p className="intro">{`Doanh thu: ${payload[1].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltip1 = ({ active, payload, label }: any) => {
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
          <p className="intro">{`Tổng đơn: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="start"
          fill="#666"
          transform="rotate(30)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // const formatMonthTick = (month: any) => {
  //   return `Tháng ${month}`;
  // };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <HeaderBreadcrumbs
        heading="Thống kê"
        links={[{ name: "Thống kê doanh thu" }]}
      />
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
            // display: "grid",
            // gap: "20px",
            // rowGap: 3,
            // columnGap: 3,
            // gridTemplateColumns: {
            //   xs: "repeat(1, 1fr)",
            //   sm: "repeat(2, 1fr)",
            //   md: "repeat(3, 1fr)",
            //   lg: "repeat(3, 1fr)",
            // },
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "10px",
          }}
        >
          <Card
            sx={{
              width: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Tổng số đơn hàng
                </Typography>
                <Typography gutterBottom variant="h5">
                  {dashboardData?.totalOrders}
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
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Tổng lợi nhuận
                </Typography>
                <Typography gutterBottom variant="h5">
                  {dashboardData?.totalProfit}
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
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Tổng doanh thu
                </Typography>
                <Typography gutterBottom variant="h5">
                  {dashboardData?.totalRevenue}
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
                  tick={<CustomXAxisTick />}
                  interval={0}
                  padding={{ left: 25, right: 25 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip1 />} />
                <Legend
                  payload={[
                    {
                      value: "Đơn hàng",
                      type: "square",
                      color: "#3498db",
                    },
                  ]}
                  wrapperStyle={{
                    position: "relative",
                    fontSize: "14px",
                  }}
                />
                <Bar dataKey="totalOrders" fill="#3498db" />
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
          sx={{ margin: "10px", border: "1px solid #d9d9d9" }}
        />
        <Box>
          <Box sx={{ width: "100%" }}>
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
                  tick={<CustomXAxisTick />}
                  interval={0}
                  padding={{ left: 25, right: 25 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip2 />} />
                <Legend
                  payload={[
                    {
                      value: "Lợi nhuận",
                      type: "square",
                      color: "#8884d8",
                    },
                    {
                      value: "Doanh thu",
                      type: "square",
                      color: "#82ca9d",
                    },
                  ]}
                  wrapperStyle={{
                    position: "relative",
                    fontSize: "14px",
                  }}
                />
                <Bar dataKey="totalProfit" fill="#8884d8" />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
