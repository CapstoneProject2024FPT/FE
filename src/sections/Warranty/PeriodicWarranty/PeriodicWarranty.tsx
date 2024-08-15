/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps, warrantyStatusMapping } from "../../../models/warranty";
import { formatDateFunc } from "../../../utils/fn";
import config from "../../../configs";
import { useNavigate } from "react-router-dom";
import moment from "moment";

type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TablePeriodicWarranty: React.FC = () => {
  const [periodicWarranty, setPeriodicWarranty] = useState<WarrantyProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const { loading, apiGetWarantyPeriodic } = ApiWarranty();
  const navigate = useNavigate();
  const [selectedCreateDate, setSelectedCreateDate] = useState<string | null>(
    null
  );
  const [selectedCompletedDate, setSelectedCompletedDate] = useState<
    string | null
  >(null);

  const handleActionDetail = (record: WarrantyProps) => {
    navigate(config.adminRoutes.maintenanceDetail.replace(":id", record.id));
  };

  //status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Process":
        return { backgroundColor: "#2196F3", color: "black" }; // xạnh
      case "Completed":
        return { backgroundColor: "#4CAF50", color: "white" }; // xanh lá
      case "AwaitingAssignment":
        return { backgroundColor: "#FFD700", color: "black" }; // vàng
      case "Cancel":
        return { backgroundColor: "#F44336", color: "white" }; // đỏ
      case "Repairing":
        return { backgroundColor: "#f39c12", color: "white" }; // cam
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const fetchWarrantyPeriodic = async () => {
    try {
      const params = {
        Type: "Periodic",
      };
      const response = await apiGetWarantyPeriodic(params);

      const keyData = response.data.map((item: WarrantyProps, idx: number) => {
        return {
          key: idx + 1,
          ...item,
        };
      });

      setPeriodicWarranty(keyData);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchWarrantyPeriodic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"],
    showSizeChanger: false,
    showQuickJumper: false,
  };

  const handleCreateDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    setSelectedCreateDate(
      Array.isArray(dateString) ? dateString[0] : dateString
    );
  };

  const handleCompletedDateChange = (
    _date: any,
    dateString: string | string[]
  ) => {
    setSelectedCompletedDate(
      Array.isArray(dateString) ? dateString[0] : dateString
    );
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = periodicWarranty
    ?.filter((item) =>
      selectedCreateDate
        ? moment(item.startDate).format("DD/MM/YYYY") === selectedCreateDate
        : true
    )
    ?.filter((item) =>
      selectedCompletedDate
        ? moment(item.completionDate).format("DD/MM/YYYY") ===
          selectedCompletedDate
        : true
    );
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
  ];

  const columns: ColumnsType<WarrantyProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Thứ tự
        </div>
      ),
      dataIndex: "key",
      align: "center",
      width: "10%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Loại Bảo Hành
        </div>
      ),
      dataIndex: "type",
      render: (type) => (type === "Periodic" ? "Định kì" : "Yêu cầu"),
      align: "center",
      width: "15%"
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Ngày bắt đầu
          <DatePicker
            onChange={handleCreateDateChange}
            style={{  width: "60%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "startDate",
      render: (startDate) => formatDateFunc.formatDate(startDate),
      align: "center",
      width: "20%"
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Ngày hoàn thành
          <DatePicker
            onChange={handleCompletedDateChange}
            style={{  width: "60%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "completionDate",
      render: (completionDate) =>
        completionDate ? formatDateFunc.formatDate(completionDate) : "-------",
      align: "center",
      width: "20%"
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Nhân viên thực hiện
        </div>
      ),
      dataIndex: "staff",
      render: (staff) => {
        const notCome = "Chưa giao nhân viên";
        if(staff?.fullName) {
          return staff.fullName;
        } else {
          return (
            <div
              style={{
                background: "grey",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "inline-block",
                color: "white",
              }}
            >
              {notCome}
            </div>
          );
        }
      },
      align: "center",
      width: "20%"
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Trạng thái
        </div>
      ),
      dataIndex: "status",
      render: (status, record) => {
        const defaultStatus = "Đang chờ xác nhận";
        const upComming = "Sắp tới";
        const notCome = "Chưa tới";

        // Check startDate
        const startDate = moment(record.startDate);
        const today = moment();
        const daysDifference = startDate.diff(today, "days");

        const statusName = status
          ? warrantyStatusMapping?.find((item) => item.id === status)?.name
          : defaultStatus;

        if (record.status !== "AwaitingAssignment") {
          return (
            <div
              style={{
                ...getStatusStyles(record.status),
                padding: "8px 16px",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              {statusName}
            </div>
          );
        }
        if (
          daysDifference >= 0 &&
          daysDifference <= 3 &&
          record.status === "AwaitingAssignment"
        ) {
          return (
            <div>
              <div style={{ color: "orange" }}>{upComming}</div>
            </div>
          );
        } else if (daysDifference >= 4) {
          return (
            <div
              style={{
                background: "grey",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "inline-block",
                color: "white",
              }}
            >
              {notCome}
            </div>
          );
        } else {
          return <div>{statusName}</div>;
        }
      },
      align: "center",
      width: "20%"
    },
    {
      title: "",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleActionDetail(record);
                    break;
                  case "2":
                    break;
                  default:
                    break;
                }
              },
            }}
          >
            <a>
              <MoreVertIcon />
            </a>
          </Dropdown>
        </Space>
      ),
      align: "center",
      width: "10%"
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TablePeriodicWarranty;
