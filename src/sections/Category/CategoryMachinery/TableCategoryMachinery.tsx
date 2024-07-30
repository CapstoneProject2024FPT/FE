import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";
import { GetCategoryProps } from "../../../models/category";
import { CategoryApi } from "../../../api/services/apiCategories";
import ModalCategoryPopup from "./PopupCategory/popupDetailCategory";
import ModalCategoryPopupAdd from "./PopupCategory/popupAddCategory";
import { toast } from "react-toastify";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableCategoryMachinery: React.FC = () => {
  const [categories, setCategories] = useState<GetCategoryProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [query, setQuery] = useState<string>("");

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GetCategoryProps | null>(
    null
  );

  //api
  const { getCategory, loading } = CategoryApi();

  //modal popup
  const handleActionDetail = (record: GetCategoryProps) => {
    setOpen(true);
    setSelectedData(record);
  };
  const handleCLose = () => setOpen(false);
  const handleCloseAdd = () => setOpenAddPopup(false);

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategorySuccess = () => {
    handleCloseAdd();
    fetchCategories();
    toast.success("Thêm loại máy thành công");
  };

  const handleUpdateCategorySuccess = (response: string) => {
    handleCLose();
    fetchCategories();
    toast.success(response);
  };

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // build detail
  const buildTree = (categories: GetCategoryProps[]) => {
    //categorymap là lưu trữ dữ kiểu có kiểu getcategory and thêm chilren để lữu trữ type child
    const categoryMap: {
      [key: string]: GetCategoryProps & { children?: GetCategoryProps[] };
    } = {};

    //lập qua foreach đưa data vào bên trong categorymap
    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // tạo mảng để lưu trữ đối tượng
    const tree: (GetCategoryProps & { children?: GetCategoryProps[] })[] = [];

    categories.forEach((category) => {
      if (category.masterCategoryId) {
        categoryMap[category.masterCategoryId]?.children?.push(
          categoryMap[category.id]
        );
      } else {
        tree.push(categoryMap[category.id]);
      }
    });

    return tree;
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase())
  );

  const treeData = buildTree(filteredCategories);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
  ];

  const columns: ColumnsType<GetCategoryProps> = [
    {
      title: <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>Loại máy</div>,
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={() => setOpenAddPopup(true)} icon={<PlusOutlined />}>
          Thêm loại máy
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={treeData}
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
        <ModalCategoryPopup
          CategoryData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateCategorySuccess}
        />
      )}

      {openAddPopup && (
        <ModalCategoryPopupAdd
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddCategorySuccess}
        />
      )}
    </>
  );
};

export default TableCategoryMachinery;
