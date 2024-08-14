/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import type { MenuProps, TablePaginationConfig } from "antd";
import type { TableProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table, Input } from "antd";
import { ApiAccount } from "../../../../../api/services/apiAccount";
import { RoleType, userModel } from "../../../../../models/UserData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../../../../configs";
import ModaBanned from "../Popup/PopupBanned";
import useDebounce from "../../../../../hooks/useDebounce";
import { ApiRank } from "../../../../../api/services/apiRank";
import { getRank } from "../../../../../models/rank";
import RankUpgradePopup from "./Modal/UpgradeRank";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const defaultPageSize = 10;

const CustomerData: React.FC = () => {
  const [data, setData] = useState<userModel[]>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<userModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { loading, apiGetUserByRole } = ApiAccount();
  const debounce = useDebounce({ delay: 500, value: query });
  const [rank, setRank] = useState<getRank[]>();
  const { apiGetRank } = ApiRank();
  const [isRankPopupOpen, setIsRankPopupOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<getRank | undefined>();
  const [selectedAccountId, setSelectedAccountId] = useState<userModel>();

  // Function to handle action click
  const handleActionClick = (record: userModel) => {
    setOpen(!open);
    setSelectedData(record);
  };

  const handleCLose = () => {
    setOpen(!open);
  };

  const handleNavigate = (record: userModel) => {
    navigate(config.adminRoutes.userDetail.replace(":id", record.id));
  };

  const fetchAccountUser = async (
    page: number = 1,
    pageSize: number = defaultPageSize,
    fullname: string = debounce
  ) => {
    const params = {
      Role: RoleType.USER,
      size: pageSize,
      page: page,
      FullName: fullname,
    };
    const response = await apiGetUserByRole(params);
    if (response.status === 200) {
      setData(response.data.items);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        current: response.data.page,
        pageSize: response.data.size,
      }));
    } else {
      toast.error(response.Error);
    }
  };

  const fetchRank = useCallback(async () => {
    const response = await apiGetRank();
    setRank(response.data);
  }, []);

  useEffect(() => {
    fetchAccountUser(pagination.current, pagination.pageSize, debounce);
    fetchRank();
  }, [debounce, pagination.current, pagination.pageSize]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    fetchAccountUser(page, pageSize);
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

  const onSuccess = () => {
    handleCLose();
    toast.success(config.AdminMessageNotice.BanOrUnbanSuccess);
    fetchAccountUser();
  };

  const onSuccessUpdateRank = () => {
    setIsRankPopupOpen(false);
    toast.success(config.AdminMessageNotice.AddRankCustomerSuccess);
    fetchAccountUser();
  };
  const handleRankClick = (record: userModel, nextRank?: getRank) => {
    setSelectedAccountId(record);
    setSelectedRank(nextRank);
    setIsRankPopupOpen(true);
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Chỉnh Trạng Thái",
    },
  ];
  const columns: ColumnsType<userModel> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tên
        </div>
      ),
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      width: "20%",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Chức vụ
        </div>
      ),
      dataIndex: "role",
      width: "20%",
      render: (role) => {
        if (role === RoleType.USER) {
          return "Người dùng";
        }
      },
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Giới tính
        </div>
      ),
      dataIndex: "gender",
      width: "10%",
      render: (gender) => {
        return gender === "Male"
          ? "Nam"
          : gender === "Female"
          ? "Nữ"
          : "Chưa cập nhật";
      },
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Hạng
        </div>
      ),
      dataIndex: "rank",
      width: "20%",
      render: (rank) => {
        return rank?.name ? rank?.name : "Chưa có hạng";
      },
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Thăng hạng
        </div>
      ),
      dataIndex: "point",
      width: "20%",
      render: (point, record) => {
        if (!rank) return "Loading...";

        //rank hiên tịa của người dùng
        const currentRank = record.rank;

        //lấy mức hạng kế
        const nextRank = rank.find(
          (r) => point >= r.range && r.range > (currentRank?.range || 0)
        );

        //rank coa nhất
        const highestRank = rank[rank.length - 1];

        if (point < rank[0].range) {
          return "Chưa đạt đủ điểm để nâng hạng";
        }

        if (point >= highestRank.range) {
          return "Đạt tới mức hạng cao nhất";
        }

        return nextRank ? (
          <a onClick={() => handleRankClick(record, nextRank)}>
            {`Có thể nâng lên hạng ${nextRank.name}`}
          </a>
        ) : (
          "Đạt tới mức hạng cao nhất có thể đạt"
        );
      },
      align: "center",
    },
    {
      title: "point",
      dataIndex: "point",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Email
        </div>
      ),
      width: "20%",
      dataIndex: "email",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Tình trạng
        </div>
      ),
      dataIndex: "status",
      width: "20%",
      render: (status) => {
        return status === "Activate"
          ? "Khả Dụng"
          : status === "Banned"
          ? "Tài Khoản bị cấm"
          : "Không khả dụng";
      },
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Action
        </div>
      ),
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case "1":
                    handleNavigate(record);
                    break;
                  case "2":
                    handleActionClick(record);
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
      <Search
        placeholder="Nhập Từ khoá"
        onChange={(e) => handleSearch(e)}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={customPagination}
        loading={loading}
        onChange={(pagination) =>
          handleTableChange(pagination.current!, pagination.pageSize!)
        }
      />
      {open && (
        <ModaBanned
          UserData={selectedData}
          handleCLose={handleCLose}
          open={open}
          onSuccess={onSuccess}
        />
      )}

      {isRankPopupOpen && (
        <RankUpgradePopup
          open={isRankPopupOpen}
          onClose={() => setIsRankPopupOpen(false)}
          rank={selectedRank}
          accountId={selectedAccountId}
          onUpdateSuccess={onSuccessUpdateRank}
        />
      )}
    </>
  );
};

export default CustomerData;
