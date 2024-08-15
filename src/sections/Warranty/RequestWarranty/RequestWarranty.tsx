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
import { useNavigate } from "react-router-dom";
import config from "../../../configs";
import moment from "moment";
type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TableRequestWarranty: React.FC = () => {
  const [requestWarranty, setRequestWarranty] = useState<WarrantyProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const navigate = useNavigate();
  const { apiGetWarantyManager, loading } = ApiWarranty();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCompletedDate, setSelectedCompletedDate] = useState<
    string | null
  >(null);
  //modal popup
  const handleActionDetail = (record: WarrantyProps) => {
    navigate(
      config.adminRoutes.maintenanceRequestDetail.replace(":id", record.id)
    );
  };

  const fetchWarrantyRequest = async () => {
    try {
      const params = {
        Type: "CustomerRequest",
      };
      const response = await apiGetWarantyManager(params);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const warrantyShow = response.data.map((item: any, idx: any) => {
        return { ...item, key: idx + 1 };
      });
      setRequestWarranty(warrantyShow);
      console.log("warrantyShow: ", warrantyShow)
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchWarrantyRequest();
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
  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
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
  const filteredRows = requestWarranty
    ?.filter((item) => selectedDate
      ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
      : true
    )
    ?.filter((item) =>
      selectedCompletedDate
        ? moment(item.completionDate).format("DD/MM/YYYY") ===
        selectedCompletedDate
        : true
    );

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
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Khách hàng
        </div>
      ),
      dataIndex: "customer",
      render: (customer) => customer?.fullName ? customer?.fullName : customer?.role,
      align: "center",
      width: "20%"
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
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Mã máy
        </div>
      ),
      dataIndex: "inventory",
      render: (inventory) => inventory.serialNumber,
      align: "center",
    },
    {
      title: (
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ marginLeft: 4, width: "100%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDateTime(createDate),
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
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px"
          }}
        >
          Hoàn thành
          <DatePicker
            onChange={handleCompletedDateChange}
            style={{ marginLeft: 4, width: "100%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "completionDate",
      render: (completionDate) =>
        completionDate
          ? formatDateFunc.formatDateTime(completionDate)
          : "-------",
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
      dataIndex: "warrantyDetai",
      render: (warrantyDetai) => {
        let status = "Unknown Status"; // Default status
        if (warrantyDetai.AwaitingAssignment === 1) {
          status = "AwaitingAssignment";
        } else if (warrantyDetai.Process === 1) {
          status = "Process";
        } else if (warrantyDetai.Repairing === 1) {
          status = "Repairing";
        } else if (warrantyDetai.Completed === 1) {
          status = "Completed";
        }

        // Get the styles for the identified status
        const styles = getStatusStyles(status);

        const statusName = warrantyStatusMapping.find(
          (item) => item.id === status
        )?.name;
        // Return the status label with the appropriate styles
        return (
          <div
            style={{
              ...styles,
              padding: "8px 16px",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            {statusName}
          </div>
        );
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

export default TableRequestWarranty;
