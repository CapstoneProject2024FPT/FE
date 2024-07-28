import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown, DatePicker } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps } from "../../../models/warranty";
import { formatDateFunc } from "../../../utils/fn";
import moment from "moment";
import dayjs from "dayjs";
type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TablePeriodicWarranty: React.FC = () => {
  const [periodicWarranty, setPeriodicWarranty] = useState<WarrantyProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const { apiGetWarantyManager, loading } = ApiWarranty();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<WarrantyProps | null>(null);

  //modal popup
  const handleActionDetail = (record: WarrantyProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => setOpen(false);

  console.log(selectedData, handleCLose);

  const fetchWarrantyPeriodic = async () => {
    try {
      const params = {
        Type: "Periodic",
      };
      const response = await apiGetWarantyManager(params);
      console.log(response);

      setPeriodicWarranty(response.data);
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
  const handleDateChange = (date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = periodicWarranty?.filter((item) =>
    selectedDate
      ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
      : true
  );
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Xoá",
    },
  ];

  const columns: ColumnsType<WarrantyProps> = [
    {
      title: <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>Loại Bảo Hành</div>,
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
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ marginLeft: 8 }}
            defaultValue={dayjs("01/01/2024", dateFormatList[0])}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>Mã số máy</div>,
      dataIndex: "inventory",
      render: (inventory) => inventory.serialNumber,
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>Hành Động</div>,
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
