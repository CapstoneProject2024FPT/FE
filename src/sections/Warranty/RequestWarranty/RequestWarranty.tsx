import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps } from "../../../models/warranty";
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
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
  const filteredRows = requestWarranty?.filter((item) =>
    selectedDate
      ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ marginLeft: 8, width: "50%" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDateTime(createDate),
      align: "center",
    },
    {
      title: "Ngày hoàn thành",
      dataIndex: "completionDate",
      render: (completionDate) =>
        completionDate
          ? formatDateFunc.formatDateTime(completionDate)
          : "-------",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Hành Động
        </div>
      ),
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
              <DownOutlined />
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
