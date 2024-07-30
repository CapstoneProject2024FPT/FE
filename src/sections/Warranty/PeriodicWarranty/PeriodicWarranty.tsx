import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps } from "../../../models/warranty";
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
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ngày bắt đầu
          <DatePicker
            onChange={handleCreateDateChange}
            style={{ marginLeft: 8, width: "50%" }}
            format={dateFormatList}
            placeholder="Ngày tạo"
          />
        </div>
      ),
      dataIndex: "startDate",
      render: (startDate) => formatDateFunc.formatDate(startDate),
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
          Ngày hoàn thành
          <DatePicker
            onChange={handleCompletedDateChange}
            style={{ marginLeft: 8, width: "50%" }}
            format={dateFormatList}
            placeholder="Ngày hoàn thành"
          />
        </div>
      ),
      dataIndex: "completionDate",
      render: (completionDate) =>
        completionDate ? formatDateFunc.formatDate(completionDate) : "-------",
      align: "center",
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
      align: "center",
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

export default TablePeriodicWarranty;
