/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
//mui
import {
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
//models
import { CreateProductFormSchema } from "../../models/products";
// form
import {
  FormProvider,
  RHFAutoComplete,
  RHFTextField,
  RHFTextFieldNumber,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import { MachineryApi } from "../../api/services/apiMachinery";
import { CategoryApi } from "../../api/services/apiCategories";
import { GetCategoryProps } from "../../models/category";
import { brandTable } from "../../models/brand";
import { BrandApi } from "../../api/services/apiBrand";
import { toast } from "react-toastify";
import { ApiOrigin } from "../../api/services/apiOrigin";
import { OriginProps } from "../../models/origin";
import { GetMachineComponents } from "../../models/machineComponent";
import ModalAddComponentOfMachineTable from "./PopupAddMachine/ModalAddComponent";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import config from "../../configs";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

interface specificationProps {
  name: string;
  value: string;
  unit: string;
}
export default function ProductNewEditForm() {
  const { apiAddMachinery } = MachineryApi();
  const { getCategoryChild } = CategoryApi();
  const { getBrand } = BrandApi();
  const { apiGetOrigin } = ApiOrigin();
  const navigate = useNavigate();

  const minTimeWarranty = 1;
  const maxTimeWarranty = 3;

  const minTimeMonthWarranty = 3;
  const maxTimeMonthWarranty = 6;

  const initialSpecifications: specificationProps = {
    name: "",
    value: "",
    unit: "",
  };

  const [categories, setCategories] = useState<GetCategoryProps[]>();
  const [brands, setBrands] = useState<brandTable[]>();
  const [origins, setOrigins] = useState<OriginProps[]>();
  const [selectedComponents, setSelectedComponents] = useState<
    GetMachineComponents[]
  >([]);
  //modal add component
  const [showModal, setShowModal] = useState(false);

  const defaultValues = {
    name: "",
    originId: "",
    description: "",
    imageURL: [],
    model: "",
    quantity: 0,
    stockPrice: 0,
    sellingPrice: 0,
    categoryId: "",
    specificationList: [initialSpecifications],
    brandId: "",
    timeWarranty: 0,
    monthWarrantyNumber: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Bắt buộc có tên sản phẩm")
      .min(1, "Tối thiểu 1 kí tự"),
    originId: Yup.string().required("Bắt buộc có xuất xứ"),
    brandId: Yup.string().required("Bắt buộc có hãng"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả")
      .min(10, "Tối thiểu 10 kí tự"),
    imageURL: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    model: Yup.string().trim().required("Bắt buộc có mẫu sản phẩm"),
    stockPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống"),
    sellingPrice: Yup.number()
      .moreThan(0, "Giá tiền lớn hơn 0")
      .required("Không để trống")
      .test(
        "sellingPriceGreaterThanStockPrice",
        "Giá bán phải lớn hơn giá nhập",
        (value, context) => {
          const { stockPrice } = context.parent;
          return value > stockPrice;
        }
      ),
    categoryId: Yup.string().required("Phải có loại máy"),
    specificationList: Yup.array()
      .of(
        Yup.object({
          name: Yup.string()
            .trim()
            .required("bắt buộc")
            .min(1, "Tối thiểu 1 kí tự")
            .test(
              "unique-name",
              "Tên thông số không được trùng lặp",
              function (value) {
                if (!value) return true; // Skip empty values

                const specList = this.from?.[1]?.value?.specificationList;

                if (!specList || !Array.isArray(specList)) return true;

                return (
                  specList.filter(
                    (spec: any) =>
                      spec.name.trim().toLowerCase() ===
                      value.trim().toLowerCase()
                  ).length <= 1
                );
              }
            ),
          value: Yup.string()
            .trim()
            .required("bắt buộc")
            .min(1, "Tối thiểu 1 kí tự"),
          unit: Yup.string().required("bắt buộc").min(1, "Tối thiểu 1 kí tự"),
        })
      )
      .min(1, "Ít nhất một thông số kỹ thuật là bắt buộc"),
    timeWarranty: Yup.number()
      .min(minTimeWarranty, `Thời gian bảo hành lớn hơn ${minTimeWarranty}`)
      .max(maxTimeWarranty, `Thời gian bảo hành nhỏ hơn ${maxTimeWarranty}`)
      .required("Thời gian bảo hành là bắt buộc"),
    monthWarrantyNumber: Yup.number()
      .min(
        minTimeMonthWarranty,
        `Thời gian bảo hành lớn hơn ${minTimeMonthWarranty}`
      )
      .max(
        maxTimeMonthWarranty,
        `Thời gian bảo hành nhỏ hơn ${maxTimeMonthWarranty}`
      )
      .required("Thời gian bảo hành là bắt buộc"),
  });

  const methods = useForm<CreateProductFormSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specificationList",
    shouldUnregister: true,
  });

  const fetchData = async () => {
    try {
      const params = {
        status: "Active",
      };
      const [category, brand, origin] = await Promise.allSettled([
        getCategoryChild(),
        getBrand(params),
        apiGetOrigin(),
      ]);

      if (category.status === "fulfilled") {
        setCategories(category.value);
      } else {
        console.error(category.reason);
      }

      if (brand.status === "fulfilled") {
        setBrands(brand.value);
      } else {
        console.error(brand.reason);
      }

      if (origin.status === "fulfilled") {
        setOrigins(origin.value.data);
      } else {
        console.error(origin.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //add machinery
  const onSubmit = async (values: CreateProductFormSchema) => {
    try {
      if (selectedComponents.length > 0) {
        // transform specifiaciotn
        const transformedSpecifications = values?.specificationList?.map(
          (spec) => ({
            name: spec.name,
            value: `${spec.value} ${spec.unit}`.replace(/\r/g, ""),
          })
        );

        // Prepare transformed data
        const transformedData = {
          ...values,
          image: values.imageURL?.map((image) => ({
            imageURL: image,
          })),
          specificationList: transformedSpecifications, // Replace with transformed list
        };

        delete transformedData.imageURL;

        const component = selectedComponents.map((item) => item.id);

        const params = {
          ...transformedData,
          machineComponentsId: component,
        };

        const response = await apiAddMachinery(params);

        if (response.status === 200) {
          setSelectedComponents([]);
          reset();
          toast.success(config.AdminMessageNotice.AddMachinerySuccess);
          navigate(config.adminRoutes.product);
        }
      } else {
        toast.error(config.AdminMessageNotice.ForgetAddComponent);
      }
    } catch (error) {
      console.error(error);
      toast.success(config.AdminMessageNotice.AddMachineryFailed);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.imageURL || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      // Update the form with the new image URLs
      setValue("imageURL", [...images, ...uploadedImages]);
    },
    [setValue, values.imageURL]
  );

  const handleRemoveAll = () => {
    setValue("imageURL", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageURL?.filter((_file) => _file !== file);
    setValue("imageURL", filteredItems);
  };

  const handleAddSpecification = () => {
    append(initialSpecifications);
  };

  const handleRemoveSpecification = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  //patse
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = event.clipboardData.getData("Text");
    const rows = clipboardData
      .split("\n")
      .filter((row: string) => row.trim() !== "");

    //get default value
    const existedData = getValues("specificationList") || [];

    //filter empty
    const filteDataExisted = existedData.filter(
      (spec) => spec.name || spec.unit || spec.value
    );

    const newFields = rows.map((row: string, index: number) => {
      const columns = row.split("\t");
      return {
        id: filteDataExisted.length + index + 1,
        name: columns[0],
        value: columns[1],
        unit: columns[2],
      };
    });

    const updatedData = [...filteDataExisted, ...newFields];

    setValue("specificationList", updatedData);
  };
  // modal add component
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (selectedComponents: GetMachineComponents[]) => {
    setSelectedComponents(selectedComponents);
    setShowModal(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField required name="name" label="Tên sản phẩm" />

              <div>
                <RHFTextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Mô tả"
                />
              </div>

              <div>
                <RHFUploadMultiFile
                  label="Hình ảnh"
                  showPreview
                  name="imageURL"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
              <div>
                <LabelStyle>Thông số kỹ thuật</LabelStyle>
                <div
                  onPaste={handlePaste}
                  style={{
                    maxHeight: "500px",
                    overflow: "auto",
                  }}
                >
                  {fields.map((field, index) => (
                    <Stack
                      direction="row"
                      key={field.id}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <RHFTextField
                        sx={{ width: 250 }}
                        name={`specificationList[${index}].name`}
                        label="Tên thông số"
                      />
                      <RHFTextField
                        sx={{ width: 250 }}
                        name={`specificationList[${index}].value`}
                        label="Giá trị"
                      />
                      <RHFTextField
                        sx={{ width: 250 }}
                        name={`specificationList[${index}].unit`}
                        label="Đơn vị"
                      />

                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveSpecification(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                  <Button
                    sx={{ mt: 4 }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddSpecification}
                  >
                    Thêm thông số
                  </Button>
                </div>
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFAutoComplete
                  name="brandId"
                  options={brands || []}
                  label="Chọn Thương hiệu máy"
                />

                <RHFAutoComplete
                  name="originId"
                  options={origins || []}
                  label="Chọn xuất xứ"
                />

                <RHFTextField required name="model" label="Mẫu sản phẩm" />

                <RHFAutoComplete
                  name="categoryId"
                  options={categories || []}
                  label="Chọn loại máy"
                />
                <RHFTextField
                  required
                  name="timeWarranty"
                  label="Thời gian bảo hành"
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Năm</InputAdornment>
                    ),
                    type: "number",
                    inputProps: { min: 0, max: maxTimeWarranty },
                  }}
                />
                <RHFTextField
                  required
                  name="monthWarrantyNumber"
                  label="Số tháng bảo hành "
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Tháng</InputAdornment>
                    ),
                    type: "number",
                  }}
                />
              </Stack>
            </Card>
            {/* component  */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <Typography variant="h5">Tên bộ phận máy</Typography>
                {selectedComponents?.map((component, idx) => (
                  <React.Fragment key={idx}>
                    <Stack>
                      {idx + 1} : {component.name}
                    </Stack>
                    <Divider />
                  </React.Fragment>
                ))}
                <Button variant="contained" onClick={handleOpenModal}>
                  Thêm bộ phận máy
                </Button>
              </Stack>
            </Card>
            {/* ---------------------------------------- */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextFieldNumber
                  required
                  name="stockPrice"
                  label="Giá máy"
                  placeholder="0.00"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">VNĐ</InputAdornment>
                    ),

                    inputProps: { min: 0 },
                  }}
                />

                <RHFTextFieldNumber
                  required
                  name="sellingPrice"
                  label="Giá bán"
                  placeholder="0.00"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">VNĐ</InputAdornment>
                    ),

                    inputProps: { min: 0 },
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Thêm sản phẩm
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
      {showModal && (
        <ModalAddComponentOfMachineTable
          handleCloseAddComponent={() => setShowModal(!showModal)}
          onSubmit={handleModalSubmit}
          open={showModal}
          selectBefore={selectedComponents}
        />
      )}
    </FormProvider>
  );
}
