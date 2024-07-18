import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps } from "../../../models/warranty";
import { formatDateFunc } from "../../../utils/fn";

type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TablePeriodicWarranty: React.FC = () => {
  const [periodicWarranty, setPeriodicWarranty] = useState<WarrantyProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const { apiGetWarantyManager, loading } = ApiWarranty();

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
      title: "Loại Bảo Hành",
      dataIndex: "type",
      render: (type) => (type === "Periodic" ? "Định kì" : "Yêu cầu"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
    },
    {
      title: "Mã số máy",
      dataIndex: "inventory",
      render: (inventory) => inventory.serialNumber,
    },
    {
      title: "Hành Động",
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
              Thêm <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={periodicWarranty}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TablePeriodicWarranty;
