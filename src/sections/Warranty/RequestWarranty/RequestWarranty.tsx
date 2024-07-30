import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Space, Dropdown } from "antd";
import { toast } from "react-toastify";
import { ApiWarranty } from "../../../api/services/apiWarranty";
import { WarrantyProps } from "../../../models/warranty";
import { formatDateFunc } from "../../../utils/fn";
import { useNavigate } from "react-router-dom";
import config from "../../../configs";

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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Cử nhân viên",
    },
  ];

  const columns: ColumnsType<WarrantyProps> = [
    {
      title: "Thứ tự",
      dataIndex: "key",
    },
    {
      title: "Loại Bảo Hành",
      dataIndex: "type",
      render: (type) => (type === "Periodic" ? "Định kì" : "Yêu cầu"),
    },
    {
      title: "Mã máy",
      dataIndex: "inventory",
      render: (inventory) => inventory.serialNumber,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDateTime(createDate),
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
              <DownOutlined />
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
