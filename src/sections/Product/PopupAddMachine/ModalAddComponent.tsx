/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Table, Input, Button, Checkbox, Modal } from "antd";
import { formatDateFunc } from "../../../utils/fn";
import { PlusOutlined } from "@ant-design/icons";
import { MachineryComponentApi } from "../../../api/services/apiMachineComponent";
import { GetMachineComponents } from "../../../models/machineComponent";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import useDebounce from "../../../hooks/useDebounce";
import { Box } from "@mui/material";
import ModalSubmitComponent from "./ModalSubmitComponent";
import ModalCreateComponent from "./ModalCreateComponent";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 15;

interface AddComponentOfMachine {
  open: boolean;
  handleCloseAddComponent: VoidFunction;
  onSubmit: (selectedComponents: GetMachineComponents[]) => void;
  selectBefore: GetMachineComponents[];
}
const ModalAddComponentOfMachineTable: React.FC<AddComponentOfMachine> = ({
  open,
  handleCloseAddComponent,
  onSubmit,
  selectBefore,
}) => {
  const [components, setComponents] = useState<GetMachineComponents[]>([]);
  const [chooseComponents, setChooseComponents] =
    useState<GetMachineComponents[]>(selectBefore);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  //search
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce({ value: query, delay: 300 });
  //popup
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [pendingIdCheck, setPendingIdCheck] = useState<string | null>(null);

  //api
  const { apiGetListComponent, loading } = MachineryComponentApi();

  //modal add
  const handleOpen = () => {
    setOpenAdd(!openAdd);
  };

  const handleClose = () => {
    setOpenAdd(!openAdd);
  };

  //modal create
  const handleOpenCreate = () => {
    setOpenCreate(!openCreate);
  };

  const handleCloseCreate = () => {
    setOpenCreate(!openCreate);
  };

  const fetchComponent = async () => {
    const response = await apiGetListComponent();
    if (response.status === 200 && response.data) {
      setComponents(response.data || []);
    }
  };

  const onSuccess = async (id: string) => {
    handleCloseCreate();
    await fetchComponent();
    setPendingIdCheck(id);
  };

  useEffect(() => {
    if (pendingIdCheck) {
      checkId(pendingIdCheck);
      setPendingIdCheck(null);
    }
  }, [components, pendingIdCheck]);

  const checkId = (id: string) => {
    const componentsCheck = components.find((component) => component.id === id);
    if (componentsCheck) {
      setChooseComponents((prev) => [...prev, componentsCheck]);
    }
  };

  // Fetch components on mount
  useEffect(() => {
    fetchComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //checkbox
  const handleCheck =
    (record: GetMachineComponents) => (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setChooseComponents((prev) => [...prev, record]);
      } else {
        setChooseComponents((prev) =>
          prev?.filter((item) => item.id !== record.id)
        );
      }
    };

  //add success
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      ...newPagination,
    });

    if (pagination.pageSize !== pagination?.pageSize) {
      setComponents([]);
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

  const filteredRows = components?.filter((item) =>
    item.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const columns: ColumnsType<GetMachineComponents> = [
    {
      title: "",
      width: "5%",
      key: "operation",
      render: (record) => (
        <Checkbox
          onChange={handleCheck(record)}
          checked={chooseComponents?.some((item) => item.id === record.id)}
        />
      ),
    },
    {
      title: "Tên bộ phận",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      render: (createDate) => {
        return formatDateFunc.formatDate(createDate);
      },
    },
  ];

  return (
    <>
      <Modal
        title="Chi tiết"
        open={open}
        onCancel={handleCloseAddComponent}
        footer={[]}
        width={900}
      >
        <Box margin={1}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Search
              placeholder="Nhập từ khoá"
              onChange={handleSearch}
              style={{ width: 200, marginBottom: 16 }}
            />
            <Box>
              <Button
                onClick={handleOpenCreate}
                icon={<PlusOutlined />}
                style={{ marginRight: "5px" }}
              >
                Tạo bộ phận máy
              </Button>
              <Button onClick={handleOpen}>Lưu bộ phận</Button>
            </Box>
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
            bordered
          />

          {openAdd && (
            <ModalSubmitComponent
              handleClose={handleClose}
              open={openAdd}
              productData={chooseComponents}
              onSubmit={onSubmit}
            />
          )}

          {openCreate && (
            <ModalCreateComponent
              handleClose={handleCloseCreate}
              open={openCreate}
              onSuccess={onSuccess}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddComponentOfMachineTable;
