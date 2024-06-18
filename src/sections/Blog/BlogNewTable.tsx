import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";

import { toast } from "react-toastify";
import { Post } from "../../models/blog";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableBlogNew: React.FC = () => {
  const [blogNews, setBlogNews] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Post | null>(null);

  //modal popup
  const handleActionDetail = (record: Post) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: Post) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };
  const handleCLose = () => {
    setOpen(!open);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  console.log(handleCLose, selectedData, handleCLoseDelete);

  //----------------------------------------------------------------------------
  const fetchBlogNews = async () => {
    try {
      //   const data = await ;
      //   setBlogNews(data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchBlogNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   const handleAddCategorySuccess = () => {
  //     handleCloseAdd();
  //     fetchBlogNews();
  //     toast.success("Thêm loại máy thành công");
  //   };

  //   const handleDeleteCategorySuccess = (response: string) => {
  //     handleCLoseDelete();
  //     fetchBlogNews();
  //     toast.success(response);
  //   };
  //   const handleUpdateCategorySuccess = (response: string) => {
  //     handleCLose();
  //     fetchBlogNews();
  //     toast.success(response);
  //   };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setBlogNews([]);
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

  const filteredRows = blogNews?.filter((item) =>
    item.title.toLowerCase().includes(query)
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
  const columns: ColumnsType<Post> = [
    {
      title: "tiêu đề",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Hình",
      dataIndex: "type",
    },
    {
      title: "Ngày tạo",
      dataIndex: "type",
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
          placeholder="Search"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Button onClick={() => {}}>Thêm Tin tức</Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableBlogNew;
