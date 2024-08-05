/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { MenuProps, TablePaginationConfig } from "antd";
import type { TableProps } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button, DatePicker } from "antd";
import ModalProductPopupDelete from "./PopupProduct/ModalProductPopupDelete";
import { toast } from "react-toastify";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import ModalProductPopupPriority from "./PopupProduct/ModalProductPopupPriority";
import { formatDateFunc } from "../../utils/fn";
import moment from "moment";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const defaultPageSize = 10;

const TableProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductAdmin[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  //search
  const [query, setQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //popup
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [openPriorityPopup, setOpenPriorityPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ProductAdmin | null>(null);

  //api
  const { apiGetMachineNoPaging, loading } = MachineryApi();

  //modal popup
  const handleActionDetail = (record: ProductAdmin) => {
    navigate(config.adminRoutes.viewDetailProduct.replace(":id", record.id));
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
      const response = await apiGetMachineNoPaging();

      if (response && response.status === 200) {
        setProducts(response.data);
      } else {
        //lỗi show thông báo lỗi
        toast.error(response.Error);
      }
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
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    if (pagination.pageSize !== pagination?.pageSize) {
      setProducts([]);
    }
  };

  const customPagination = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    pageSizeOptions: ["20", "25", "50"],
    showSizeChanger: false,
    showQuickJumper: false,
    onChange: handleTableChange,
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const filteredRows = products
    ?.filter((item) => item.name?.toLowerCase().includes(query.toLowerCase()))
    ?.filter((item) =>
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
      label: "Ngưng bán",
    },
    {
      key: "3",
      label: "Bán lại",
    },
    {
      key: "4",
      label: "Chỉnh độ ưu tiên",
    },
  ];
  const columns: ColumnsType<ProductAdmin> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tên máy
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Hình máy
        </div>
      ),
      dataIndex: "image",
      render: (images) => (
        <img
          src={images[0]?.imageURL}
          alt="Product Image"
          style={{ width: 100 }}
        />
      ),
      align: "center",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      render: (brand) => {
        return brand.name;
      },
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Số lượng
        </div>
      ),
      dataIndex: "quantity",
      render: (quantity) => quantity.Available || 0,
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Độ ưu tiên
        </div>
      ),
      dataIndex: "priority",
      render: (priority) => priority || 0,
      sorter: (a, b) => a.priority - b.priority,
      align: "center",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (status) => (status === "Available" ? "Đang bán" : "Ngưng bán"),
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
      render: (createDate) => formatDateFunc.formatDate(createDate),
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
              items: items.filter((item) => {
                if (item && item.key) {
                  if (record.status === "Available") {
                    return ["1", "2", "4"].includes(item.key as string);
                  } else {
                    return ["1", "3"].includes(item.key as string);
                  }
                }
                return true;
              }),
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleActionDetail(record);
                    break;
                  case "2":
                    handleActionDelete(record);
                    break;
                  case "3":
                    handleActionDelete(record);
                    break;
                  case "4":
                    handleActionPriority(record);
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
      <div style={{ display: "flex" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button
          icon={<PlusOutlined />}
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
        bordered
        loading={loading}
        onChange={(pagination) =>
          handleTableChange(pagination.current!, pagination.pageSize!)
        }
        locale={{
          triggerDesc: "Sắp xếp giảm dần",
          triggerAsc: "Sắp xếp tăng dần",
          cancelSort: "Huỷ sắp xếp",
        }}
        style={{ textAlign: "center" }} // Center all text in table
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
