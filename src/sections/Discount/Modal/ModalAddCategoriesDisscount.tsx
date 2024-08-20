/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Table, Input, Button, Checkbox, Modal } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import useDebounce from "../../../hooks/useDebounce";
import { Box } from "@mui/material";
import { GetCategoryProps } from "../../../models/category";
import { CategoryApi } from "../../../api/services/apiCategories";
import { categoriesProps } from "../../../models/discount";
import { toast } from "react-toastify";
import config from "../../../configs";
import { ApiDiscount } from "../../../api/services/apiDiscount";

type ColumnsType<T> = TableProps<T>["columns"];
const { Search } = Input;

const pageSize = 15;

interface AddCategories {
  open: boolean;
  handleClose: VoidFunction;
  handleCloseSubmit: () => void;
  selectBefore: GetCategoryProps[] | categoriesProps[];
  idDiscount: string | undefined;
}
const ModalAddCategories: React.FC<AddCategories> = ({
  open,
  handleClose,
  handleCloseSubmit,
  selectBefore,
  idDiscount,
}) => {
  const [categories, setCategories] = useState<GetCategoryProps[]>([]);
  const [chooseCategories, setChooseCategories] = useState<
    GetCategoryProps[] | categoriesProps[]
  >(selectBefore);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
  });

  //search
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce({ value: query, delay: 300 });

  //api
  const { getCategoryChild, loading } = CategoryApi();
  const { apiAddCategoriesForDiscountId } = ApiDiscount();

  const fetchComponent = async () => {
    const response = await getCategoryChild();

    setCategories(response || []);
  };

  // Fetch components on mount
  useEffect(() => {
    fetchComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //checkbox
  const handleCheck =
    (record: GetCategoryProps) => (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        setChooseCategories((prev) => (prev ? [...prev, record] : [record]));
      } else {
        setChooseCategories((prev) =>
          prev ? prev.filter((item) => item.id !== record.id) : []
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
      setCategories([]);
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

  const filteredRows = categories?.filter((item) =>
    item.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  // Submit
  const onSubmit = async () => {
    try {
      if (!chooseCategories) {
        toast.error(config.AdminMessageNotice.DiscountCategories);
        return;
      }

      if (!idDiscount) return;

      const transformData = chooseCategories.map((item) => item.id);

      const response = await apiAddCategoriesForDiscountId(
        idDiscount,
        transformData
      );
      if (response.status === 200) {
        toast.success(config.AdminMessageNotice.DiscountCategoriesSuccess);
        handleCloseSubmit();
      } else {
        toast.error(response.Error);
      }
    } catch (error) {
      toast.error(config.AdminMessageNotice.DiscountCategoriesFailed);
      console.log(error);
    }
  };

  const columns: ColumnsType<GetCategoryProps> = [
    {
      title: "",
      width: "5%",
      key: "operation",
      render: (record) => (
        <Checkbox
          onChange={handleCheck(record)}
          checked={chooseCategories?.some((item) => item.id === record.id)}
        />
      ),
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
          Tên loại máy
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "40%",
    },
  ];

  return (
    <>
      <Modal
        title="Chi tiết"
        open={open}
        onCancel={handleClose}
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
              <Button onClick={onSubmit}>Lưu Loại máy giảm giá</Button>
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
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddCategories;
