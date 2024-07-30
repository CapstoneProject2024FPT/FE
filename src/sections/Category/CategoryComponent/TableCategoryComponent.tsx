import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";
import { GetCategoryProps } from "../../../models/category";
import ModalCategoryPopupComponent from "./PopupCategoryComponent/popupDetailCategoryComponent";
import { toast } from "react-toastify";
import ModalCategoryPopupAddComponent from "./PopupCategoryComponent/popupAddCategoryComponent";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryComponentApi } from "../../../api/services/apiCategoriesComponent";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableCategoryComponent: React.FC = () => {
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
  const { getCategoryComponent, loading } = CategoryComponentApi();

  //modal popup
  const handleActionDetail = (record: GetCategoryProps) => {
    setOpen(true);
    setSelectedData(record);
  };
  const handleCLose = () => setOpen(false);
  const handleCloseAdd = () => setOpenAddPopup(false);

  const fetchCategoriesComponent = async () => {
    try {
      const data = await getCategoryComponent();
      setCategories(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchCategoriesComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategorySuccess = () => {
    handleCloseAdd();
    fetchCategoriesComponent();
    toast.success("Thêm loại máy thành công");
  };

  const handleUpdateCategorySuccess = (response: string) => {
    handleCLose();
    fetchCategoriesComponent();
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
      title: "Loại máy",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={() => setOpenAddPopup(true)} icon={<PlusOutlined />}>
          Thêm loại bộ phận
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={treeData}
        pagination={customPagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {open && (
        <ModalCategoryPopupComponent
          CategoryData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateCategorySuccess}
        />
      )}

      {openAddPopup && (
        <ModalCategoryPopupAddComponent
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddCategorySuccess}
        />
      )}
    </>
  );
};

export default TableCategoryComponent;
