import React from "react";
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
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";

const data = [
  {
    name: "Tháng 1",
    value: 2400,
  },
  {
    name: "Tháng 2",
    value: 1398,
  },
  {
    name: "Tháng 3",
    value: 9800,
  },
  {
    name: "Tháng 4",
    value: 3908,
  },
  {
    name: "Tháng 5",
    value: 4800,
  },
  {
    name: "Tháng 6",
    value: 3800,
  },
  {
    name: "Tháng 7",
    value: 4300,
  },
  {
    name: "Tháng 8",
    value: 9800,
  },
  {
    name: "Tháng 9",
    value: 3908,
  },
  {
    name: "Tháng 10",
    value: 4800,
  },
  {
    name: "Tháng 11",
    value: 3800,
  },
  {
    name: "Tháng 12",
    value: 4300,
  },
];

const dataPie = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard: React.FC = () => {

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-30)"
        >
          {payload.value}
        </text>
      </g>
    );
  };
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Thống kê"
        links={[{ name: "Thống kê doanh thu" }]}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: "40px",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: {
              xs: "repeat(1, fr)",
              sm: "repeat(2, 1fr)",
            },
            height: "fit-content",
          }}
        >
          <Card
            sx={{
              maxWidth: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Số lượng khách hàng đã đăng ký
                </Typography>
                <Typography gutterBottom variant="h5">
                  1500
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Số lượng khách hàng đã đăng ký
                </Typography>
                <Typography gutterBottom variant="h5">
                  1500
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 300,
              minWidth: 150,
              height: 130,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardActionArea sx={{ height: 130 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Số lượng khách hàng đã đăng ký
                </Typography>
                <Typography gutterBottom variant="h5">
                  1500
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ margin: "5px", border: "1px solid #d9d9d9" }}
        />
        <Box>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid />
              <XAxis dataKey="name" tick={<CustomXAxisTick />} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width={500} height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                outerRadius={80}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
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
    </Container>
  );
};

export default Dashboard;
