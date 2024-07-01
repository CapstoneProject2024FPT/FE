import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table, Input, Space, Dropdown, Button } from "antd";
import { getRank } from "../../models/rank";
import { ApiRank } from "../../api/services/apiRank";
import { toast } from "react-toastify";
import { fNumber } from "../../utils/formatNumber";
import ModalRankDetail from "./PopupRank/ModalRankDetail";
import { PlusOutlined } from "@ant-design/icons";
import ModalRankAdd from "./PopupRank/ModalAddRank";
import ModalRankDelete from "./PopupRank/ModalDeleteRank";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

const TableRank: React.FC = () => {
  const [ranks, setRanks] = useState<getRank[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [open, setOpen] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<getRank | null>(null);

  //api
  const { loading, apiGetRank } = ApiRank();

  //modal popup
  const handleActionDetail = (record: getRank) => {
    setOpen(!open);
    setSelectedData(record);
  };
  const handleActionDelete = (record: getRank) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };
  const handleCLose = () => {
    setOpen(!open);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };
  const handleCloseAdd = () => {
    setOpenAddPopup(!openAddPopup);
  };

  //----------------------------------------------------------------------------
  const fetchRank = async () => {
    try {
      const response = await apiGetRank();
      if (response.status === 200) {
        setRanks(response.data);
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error("lỗi");
    }
  };

  useEffect(() => {
    fetchRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRankSuccess = () => {
    handleCloseAdd();
    fetchRank();
    toast.success("Thêm hạng thành công");
  };

  const handleDeleteRankSuccess = (response: string) => {
    handleCLoseDelete();
    fetchRank();
    toast.success(response);
  };
  const handleUpdateRankSuccess = (response: string) => {
    handleCLose();
    fetchRank();
    toast.success(response);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setRanks([]);
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

  const filteredRows = ranks?.filter((item) =>
    item.name.toLowerCase().includes(query)
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
  const columns: ColumnsType<getRank> = [
    {
      title: "Tên hạng ",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "20%",
    },
    {
      title: "Hạng mức",
      dataIndex: "range",
      render: (range) => fNumber(range),
      sorter: (a, b) => a.range - b.range,
      showSorterTooltip: true,
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
        <Button
          onClick={() => setOpenAddPopup(!openAddPopup)}
          icon={<PlusOutlined />}
        >
          Thêm loại máy
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
        <ModalRankDetail
          RankData={selectedData}
          open={open}
          handleClose={handleCLose}
          onUpdateSuccess={handleUpdateRankSuccess}
        />
      )}

      {openDeletePopup && (
        <ModalRankDelete
          RankData={selectedData}
          open={openDeletePopup}
          handleClose={handleCLoseDelete}
          onDeleteSuccess={handleDeleteRankSuccess}
        />
      )}

      {openAddPopup && (
        <ModalRankAdd
          open={openAddPopup}
          handleClose={handleCloseAdd}
          onAddSuccess={handleAddRankSuccess}
        />
      )}
    </>
  );
};

export default TableRank;
