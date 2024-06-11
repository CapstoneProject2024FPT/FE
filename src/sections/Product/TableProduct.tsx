import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";
import ModalProductPopupDelete from "./PopupProduct/ModalProductPopupDelete";
import { toast } from "react-toastify";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import ModalProductPopupPriority from "./PopupProduct/ModalProductPopupPriority";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductAdmin[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openPriorityPopup, setOpenPriorityPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ProductAdmin | null>(null);

  //api
  const { apiGetProduct, loading } = MachineryApi();

  //modal popup
  const handleActionDetail = (record: ProductAdmin) => {
    setSelectedData(record);
  };

  //delete
  const handleActionDelete = (record: ProductAdmin) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };

  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  //update priority
  const handleActionPriority = (record: ProductAdmin) => {
    setOpenPriorityPopup(!openPriorityPopup);
    setSelectedData(record);
  };

  const handleCLosePriority = () => {
    setOpenPriorityPopup(!openPriorityPopup);
  };

  //----------------------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const data = await apiGetProduct("Active");
      console.log(data);

      setProducts(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteCategorySuccess = (response: string) => {
    handleCLoseDelete();
    fetchProducts();
    toast.success(response);
  };

  const handleUpdatePriorityCategorySuccess = (response: string) => {
    handleCLosePriority();
    fetchProducts();
    toast.success(response);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setProducts([]);
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

  const filteredRows = products?.filter((item) =>
    item.name?.toLowerCase().includes(query)
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
    {
      key: "3",
      label: "Chỉnh độ ưu tiên",
    },
  ];
  const columns: ColumnsType<ProductAdmin> = [
    {
      title: "Tên máy",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
    {
      title: "hình máy",
      dataIndex: "image",
      render: (images) => (
        <img
          src={images[0]?.imageURL}
          alt="Product Image"
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Mẫu máy",
      dataIndex: "model",
    },
    {
      title: "Xuất xứ",
      dataIndex: "origin",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity) => quantity || 0,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      render: (priority) => priority || 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "",
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
                  case "3":
                    handleActionPriority(record);
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
          placeholder="Search"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button
          onClick={() => {
            navigate(config.adminRoutes.createProduct);
          }}
        >
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
      />

      {openDeletePopup && (
        <ModalProductPopupDelete
          ProductData={selectedData}
          openDeletePopup={openDeletePopup}
          handleCLoseDelete={handleCLoseDelete}
          onDeleteSuccess={handleDeleteCategorySuccess}
        />
      )}

      {openPriorityPopup && (
        <ModalProductPopupPriority
          ProductData={selectedData}
          openPriorityPopup={openPriorityPopup}
          handleCLosePriority={handleCLosePriority}
          onUpdatePrioritySuccess={handleUpdatePriorityCategorySuccess}
        />
      )}
    </>
  );
};

export default TableProduct;
