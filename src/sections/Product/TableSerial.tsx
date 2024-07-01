import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";

import { serialProps } from "../../models/serialNumber";
import { ApiSerial } from "../../api/services/apiSerialNumber";
import { toast } from "react-toastify";
import { formatDateFunc } from "../../utils/fn";
import { useParams } from "react-router-dom";
import ModalAddSerialPopup from "./PopupSerialnumber/ModalAddSerialNumber";
import ModalSerialNumberDelete from "./PopupSerialnumber/ModalDeleteSerialNumber";
import { PlusOutlined } from "@ant-design/icons";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableSerial: React.FC = () => {
  const [serialNumbers, setSerialNumbers] = useState<serialProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //url
  const { id } = useParams<{ id: string }>();
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<serialProps | null>(null);

  //api
  const { apiGetSerialbyMachineId, loading } = ApiSerial();

  //modal popup
  const handleActionDetail = (record: serialProps) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: serialProps) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleCLose = () => {
    setOpen(!open);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  //----------------------------------------------------------------------------
  const fetchSerialMachine = async () => {
    try {
      if (id) {
        const response = await apiGetSerialbyMachineId(id);

        setSerialNumbers(response.data);
        setSelectedData(response.data[0]);
      } else {
        setSerialNumbers([]);
        setSelectedData(null);
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchSerialMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSuccess = () => {
    handleCLose();
    fetchSerialMachine();
    toast.success("Thêm thành công");
  };

  const handleDeleteSerialSuccess = (response: string) => {
    handleCLoseDelete();
    fetchSerialMachine();
    toast.success(response);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setSerialNumbers([]);
    }
  };

  const customPagination = {
    ...pagination,
    onChange: handleTableChange,
    pageSizeOptions: ["20", "25", "50"], // Custom page size options
    showSizeChanger: false, // Show page size changer
    showQuickJumper: false, // Show quick jumper
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredRows = serialNumbers?.filter((item) =>
    item.serialNumber.toLowerCase().includes(query)
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
  const columns: ColumnsType<serialProps> = [
    {
      title: "Số seri",
      dataIndex: "serialNumber",
      sorter: (a, b) => a.serialNumber.length - b.serialNumber.length,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        return status === "Available"
          ? "Còn"
          : status === "Sold"
          ? "Đã bán"
          : "Tạm dừng";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => {
        return formatDateFunc.formatDate(createDate);
      },
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
                    handleActionDelete(record);
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={handleOpen} icon={<PlusOutlined />}>
          Thêm máy
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{
          triggerDesc: "Sắp xếp giảm dần",
          triggerAsc: "Sắp xếp tăng dần",
          cancelSort: "Huỷ sắp xếp",
        }}
      />
      {open && (
        <ModalAddSerialPopup
          ProductData={selectedData}
          open={open}
          handleCLose={handleCLose}
          onSuccess={handleAddSuccess}
        />
      )}

      {openDeletePopup && (
        <ModalSerialNumberDelete
          ProductData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteSerialSuccess}
        />
      )}
    </>
  );
};

export default TableSerial;
