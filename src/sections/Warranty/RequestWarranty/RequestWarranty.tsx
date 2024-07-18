import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyGetProps } from "../../../models/warranty";

type ColumnsType<T> = TableProps<T>["columns"];

const pageSize = 20;

const TableRequestWarranty: React.FC = () => {
  const [requestWarranty, setRequestWarranty] = useState<WarrantyGetProps[]>(
    []
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const { apiGetWarantyManager, loading } = ApiWarranty();

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<WarrantyGetProps | null>(
    null
  );

  //modal popup
  const handleActionDetail = (record: WarrantyGetProps) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => setOpen(false);

  console.log(selectedData, handleCLose);
  const fetchWarrantyRequest = async () => {
    try {
      const params = {
        Type: "CustomerRequest",
      };
      const response = await apiGetWarantyManager(params);

      setRequestWarranty(response.data);
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

  const columns: ColumnsType<WarrantyGetProps> = [
    {
      title: "Loại Bảo Hành",
      dataIndex: "type",
      width: "40%",
      render: (type) => (type === "Periodic" ? "Định kì" : "Yêu cầu"),
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
        dataSource={requestWarranty}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableRequestWarranty;
