import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import type { TableProps } from "antd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Table,
  Input,
  Space,
  Dropdown,
  Button,
  Typography,
  Select,
  DatePicker,
} from "antd";

import { serialProps } from "../../models/serialNumber";
import { ApiSerial } from "../../api/services/apiSerialNumber";
import { toast } from "react-toastify";
import { formatDateFunc } from "../../utils/fn";
import { useParams } from "react-router-dom";
import ModalAddSerialPopup from "./PopupSerialnumber/ModalAddSerialNumber";
import ModalSerialNumberDelete from "./PopupSerialnumber/ModalDeleteSerialNumber";
import { PlusOutlined } from "@ant-design/icons";
import { MachineryApi } from "../../api/services/apiMachinery";
import { ProductAdmin } from "../../models/products";
import config from "../../configs";
import moment from "moment";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 20;

interface TableSerial {
  handleSetName: (text: string) => void;
}
const TableSerial: React.FC<TableSerial> = ({ handleSetName }) => {
  const [serialNumbers, setSerialNumbers] = useState<serialProps[]>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });
  const [machinery, SetMachinery] = useState<ProductAdmin>();
  //url
  const { id } = useParams<{ id: string }>();
  //search
  const [query, setQuery] = useState<string>("");

  //popup
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<serialProps | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  //api
  const { apiGetSerialbyMachineId, loading } = ApiSerial();
  const { apiGetDetailMachine } = MachineryApi();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //modal popup
  const handleActionDelete = (record: serialProps) => {
    setOpenDeletePopup(!openDeletePopup);
    setSelectedData(record);
  };

  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString);
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const handleOpen = () => {
    setOpenAdd(!openAdd);
  };

  const handleCLose = () => {
    setOpenAdd(!openAdd);
  };
  const handleCLoseDelete = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  const fetchMachineDetail = async () => {
    if (id) {
      const response = await apiGetDetailMachine(id);
      SetMachinery(response.data);
      handleSetName(response.data.name);
    }
  };
  //----------------------------------------------------------------------------
  const fetchSerialMachine = async (status = selectedFilter) => {
    try {
      if (id) {
        const params = {
          MachineryId: id,
          Status: status,
        };
        const response = await apiGetSerialbyMachineId(params);

        setSerialNumbers(response.data);
        setSelectedData(response.data[0]);
      } else {
        setSerialNumbers([]);
        setSelectedData(null);
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.ErrorGet);
    }
  };

  useEffect(() => {
    fetchSerialMachine();
    fetchMachineDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSuccess = () => {
    handleCLose();
    fetchSerialMachine();
    toast.success(config.AdminMessageNotice.AddMachineToBarn);
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

  const filteredRows = serialNumbers
    ?.filter((item) => item.serialNumber.toLowerCase().includes(query))
    ?.filter((item) =>
      selectedDate
        ? moment(item.createDate).format("DD/MM/YYYY") === selectedDate
        : true
    );
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xoá",
    },
  ];
  const columns: ColumnsType<serialProps> = [
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Số seri(Mã số máy)
        </div>
      ),
      dataIndex: "serialNumber",
      sorter: (a, b) => a.serialNumber.length - b.serialNumber.length,
      width: "20%",
      align: "center",
    },
    {
      title: (
        <div
          style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          Trạng thái
        </div>
      ),
      dataIndex: "status",
      render: (status) => {
        return status === "Available"
          ? "Còn"
          : status === "Sold"
          ? "Đã bán"
          : "Có người mua";
      },
      align: "center",
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
            gap: "5px",
          }}
        >
          Ngày tạo
          <DatePicker
            onChange={handleDateChange}
            style={{ width: "30%", cursor: "pointer" }}
            format={dateFormatList}
            placeholder="Chọn ngày"
          />
        </div>
      ),
      dataIndex: "createDate",
      render: (createDate) => {
        return formatDateFunc.formatDate(createDate);
      },
      align: "center",
    },
    {
      title: "",
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
              <MoreVertIcon />
            </a>
          </Dropdown>
        </Space>
      ),
      align: "center",
    },
  ];

  const handleChange = (value: string) => {
    let valueSelect = value;
    if (valueSelect === "all") {
      valueSelect = "";
    }
    setSelectedFilter(valueSelect);
    fetchSerialMachine(valueSelect);
  };
  return (
    <>
      <Typography.Text>Tên máy: {machinery?.name}</Typography.Text>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <Search
          placeholder="Nhập từ khoá"
          onChange={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <div>
          <Select
            defaultValue="Tất cả"
            style={{ width: 150, marginRight: "5px" }}
            onChange={handleChange}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "Available", label: "Còn" },
              { value: "Sold", label: "Đã bán" },
              { value: "Pending", label: "Có người mua" },
            ]}
          />
          <Button onClick={handleOpen} icon={<PlusOutlined />}>
            Thêm số lượng máy
          </Button>
        </div>
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
        <ModalAddSerialPopup
          productData={machinery}
          open={openAdd}
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
