import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button, Typography } from "antd";

import { conditionSerial, serialProps } from "../../models/serialNumber";
import { ApiSerial } from "../../api/services/apiSerialNumber";
import { toast } from "react-toastify";
import { formatDateFunc } from "../../utils/fn";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import ModalAddSerialComponent from "./PopupSerialComponent/ModalAddSerialNumberComponent";
import ModalSerialNumberComponentDelete from "./PopupSerialComponent/ModalDeleteSerialNumberComponent";
import { GetMachineComponents } from "../../models/machineComponent";
import { MachineryComponentApi } from "../../api/services/apiMachineComponent";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

interface TableSerial {
  handleSetName: (text: string) => void;
}
const TableSerialComponent: React.FC<TableSerial> = ({ handleSetName }) => {
  const [serialNumbers, setSerialNumbers] = useState<serialProps[]>([]);
  const [masterId, setMasterId] = useState<string[]>([]);
  const [masterIdInven, setMasterIdInven] = useState<Record<string, string>>(
    {}
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [component, SetComponent] = useState<GetMachineComponents>();
  //url
  const { id } = useParams<{ id: string }>();
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<serialProps | null>(null);

  //api
  const {
    apiGetSerialbyMachineComponentId,
    loading,
    apiGetByMasterCategoryId,
  } = ApiSerial();
  const { apiGetMachineryComponentDetail } = MachineryComponentApi();
  //modal popup
  const handleActionDelete = (record: serialProps) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };

  const handleOpen = () => {
    setOpenAdd(!openAdd);
  };

  const handleCLose = () => {
    setOpenAdd(!openAdd);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  const fetchMachineComponentDetail = async () => {
    if (id) {
      const response = await apiGetMachineryComponentDetail(id);
      SetComponent(response.data);
      handleSetName(response.data.name);
    }
  };

  const fetchMachineInventory = async (id: string[]) => {
    try {
      const MachineInventory = await Promise.all(
        id.map(async (item) => {
          const response = await apiGetByMasterCategoryId(item);
          return { id: item, name: response.data.serialNumber };
        })
      );
      const machineInventoryMap = MachineInventory.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<string, string>);
      setMasterIdInven(machineInventoryMap);
    } catch (error) {
      console.error("Lỗi sản phẩm", error);
    }
  };

  // api get serial numberMAchinebyMassterCategoryId
  //----------------------------------------------------------------------------
  const fetchSerialMachine = async () => {
    try {
      if (id) {
        const response = await apiGetSerialbyMachineComponentId(id);

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
    fetchMachineComponentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ids = serialNumbers
      .filter((item) => item.masterInventoryId !== null)
      .map((item) => item.masterInventoryId);
    setMasterId(ids);
  }, [serialNumbers]);

  useEffect(() => {
    if (masterId.length > 0) {
      fetchMachineInventory(masterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId]);

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
      title: "Tình trạng",
      dataIndex: "condition",
      render: (condition) => {
        return condition === conditionSerial.OLD
          ? "Cũ"
          : condition === conditionSerial.NEW
          ? "Mới"
          : "Đang dùng";
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
      title: "Dùng cho máy",
      dataIndex: "masterInventoryId",
      render: (masterInventoryId) => {
        return masterIdInven[masterInventoryId] || "Chưa có máy dùng";
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
      <Typography.Text>Tên máy: {component?.name}</Typography.Text>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={handleOpen} icon={<PlusOutlined />}>
          Thêm số lượng máy
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
      {openAdd && (
        <ModalAddSerialComponent
          productData={component}
          open={openAdd}
          handleCLose={handleCLose}
          onSuccess={handleAddSuccess}
        />
      )}

      {openDeletePopup && (
        <ModalSerialNumberComponentDelete
          ProductData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteSerialSuccess}
        />
      )}
    </>
  );
};

export default TableSerialComponent;
