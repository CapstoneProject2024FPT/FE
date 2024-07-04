import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";
import { toast } from "react-toastify";
import { PostGetProps } from "../../models/blog";
import { PlusOutlined } from "@ant-design/icons";
import { ApiNews } from "../../api/services/apiNews";
import { formatDateFunc } from "../../utils/fn";
import { useNavigate } from "react-router-dom";
import config from "../../configs";
import BlogAbleModal from "./PopupBLog/BlogAbleModal";
import BlogHotModal from "./PopupBLog/BlogHotModal";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableBlogNew: React.FC = () => {
  const navigate = useNavigate();
  const { apiGetNews } = ApiNews();
  const [blogNews, setBlogNews] = useState<PostGetProps[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [openStatusPopup, setOpenStatusPopup] = useState<boolean>(false);
  const [openHotPopup, setOpenHotPopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PostGetProps | null>(null);

  //modal popup
  const handleActionDetail = (record: PostGetProps) => {
    navigate(config.adminRoutes.blog.replace(":id", record.id));
  };
  const handleActionOpenPopupStatus = (record: PostGetProps) => {
    setOpenStatusPopup(!openStatusPopup);
    setSelectedData(record);
  };

  const handleCLoseStatusPopup = () => {
    setOpenStatusPopup(!openStatusPopup);
  };

  const handleOpenHot = (record: PostGetProps) => {
    setSelectedData(record);
    setOpenHotPopup(!openHotPopup);
  };

  const handleCloseOpenHot = () => {
    setOpenHotPopup(!openHotPopup);
  };
  //----------------------------------------------------------------------------
  const fetchBlogNews = async () => {
    try {
      const response = await apiGetNews();

      setBlogNews(response.data);
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchBlogNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateHotNewsSuccess = () => {
    handleCloseOpenHot();
    fetchBlogNews();
    toast.success("Cập nhật thành công");
  };

  const handleUpdateStatusNewsSuccess = (text: string) => {
    handleCLoseStatusPopup();
    fetchBlogNews();
    toast.success(text);
  };
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
      label: "Điều chỉnh trạng thái",
    },
    {
      key: "3",
      label: "Điều chỉnh độ hot",
    },
  ];
  const columns: ColumnsType<PostGetProps> = [
    {
      title: "tiêu đề",
      dataIndex: "title",
      width: "20%",
    },
    {
      title: "Hình",
      dataIndex: "cover",
      render: (cover) => (
        <img src={cover} alt="ảnh bìa" style={{ width: 100 }} />
      ),
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => formatDateFunc.formatDate(createDate),
    },
    {
      title: "Người viết",
      dataIndex: "account",
      render: (account) => account.fullName,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      render: (status) => (status === "Active" ? "Đang hiển thị" : "Đang ẩn"),
    },
    {
      title: "Độ hot",
      dataIndex: "type",
      render: (type) => (type === "Normal" ? "Bình Thường" : "Tin Nóng" || ""),
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
                    handleActionOpenPopupStatus(record);
                    break;
                  case "3":
                    handleOpenHot(record);
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
        <Button
          onClick={() => {
            navigate(config.adminRoutes.createNew);
          }}
          icon={<PlusOutlined />}
        >
          Thêm Tin tức
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredRows}
        pagination={customPagination}
        onChange={handleTableChange}
        bordered
      />

      {openStatusPopup && (
        <BlogAbleModal
          NewsData={selectedData}
          handleCLose={handleCLoseStatusPopup}
          onUpdateSuccess={handleUpdateStatusNewsSuccess}
          open={openStatusPopup}
        />
      )}
      {openHotPopup && (
        <BlogHotModal
          NewsData={selectedData}
          handleCLose={handleCloseOpenHot}
          onUpdateSuccess={handleUpdateHotNewsSuccess}
          open={openHotPopup}
        />
      )}
    </>
  );
};

export default TableBlogNew;
