import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Grid, Card, Stack, Button, Box } from "@mui/material";
// routes
// @types
import { NewPostFormValues } from "../../models/blog";
// components
import {
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFSelect,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import PreviewDialog from "./PopupBLog/BlogNewPostPreview";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import { toast } from "react-toastify";
import { NewsCategoryProps } from "../../models/newCategories";
import { ApiNewsCategories } from "../../api/services/apiNewsCategories";
import { ApiNews } from "../../api/services/apiNews";
import config from "../../configs";
import { useNavigate } from "react-router-dom";
//

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  // const navigate = useNavigate();
  const [newsCategories, setNewsCategories] = useState<NewsCategoryProps[]>([]);
  const { getNewsCategoriesAvailable } = ApiNewsCategories();
  const [open, setOpen] = useState(false);
  const { apiPostNews } = ApiNews();
  const navigate = useNavigate();

  const loginInfoString = localStorage.getItem("loginInfo");
  const auth = loginInfoString ? JSON.parse(loginInfoString) : null;
  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string()
      .required("Phải có chủ đề")
      .min(10, "Tối thiểu 10 từ")
      .trim(),
    description: Yup.string()
      .required("phải có mô tả")
      .min(10, "Tối thiểu 10 từ")
      .trim(),
    newsContent: Yup.string()
      .min(200, "Tổi thiểu 200 từ")
      .required("Content is required")
      .trim(),
    cover: Yup.string().required("Bắt Buộc có hình"),
    imageURL: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    newsCategoryId: Yup.string().required("Bắt chọn loại tin tức"),
  });

  const defaultValues: NewPostFormValues = {
    title: "",
    description: "",
    newsContent: "",
    cover: "",
    imageURL: [],
    newsCategoryId: "",
  };

  const methods = useForm<NewPostFormValues>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const fetchNewsCategories = async () => {
    const params = {
      status: "Active",
    };

    const response = await getNewsCategoriesAvailable(params);

    if (response?.status === 200) {
      setNewsCategories(response.data);
    } else {
      toast.error(response.Error);
    }
  };

  useEffect(() => {
    fetchNewsCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: NewPostFormValues) => {
    try {
      const id: string = auth?.data.id;

      const transformedData = {
        ...data,
        accountId: id,
        image: values.imageURL?.map((image) => ({
          imageURL: image,
        })),
      };
      delete transformedData.imageURL;

      const response = await apiPostNews(transformedData);
      if (response.status === 200) {
        toast.success(config.AdminMessageNotice.AddBlogSucces);
        navigate(config.adminRoutes.blogs);
        handleClosePreview();
        reset();
      } else {
        toast.error(config.AdminMessageNotice.AddBlogFailed);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];

      const coverImage = await uploadImageToFirebase(file);
      if (typeof coverImage === "string") {
        setValue("cover", coverImage);
      }
    },
    [setValue]
  );

  const handleDropImage = useCallback(
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
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Chủ đề" />

                <RHFTextField
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={3}
                />

                <div>
                  <RHFEditor simple name="newsContent" label="Nội dung" />
                </div>
                <div>
                  <RHFUploadMultiFile
                    label="Ảnh"
                    showPreview
                    name="imageURL"
                    maxSize={3145728}
                    onDrop={handleDropImage}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                  />
                </div>
                <div>
                  <RHFUploadSingleFile
                    label="Hình nền"
                    name="cover"
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </div>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Box>
                <RHFSelect
                  name="newsCategoryId"
                  label="Loại tin tức"
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="">Chọn loại tin tức</option>
                  {newsCategories.map((newsCate) => (
                    <option key={newsCate.id} value={newsCate.id}>
                      {newsCate.name}
                    </option>
                  ))}
                </RHFSelect>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="baseline"
                  spacing={1.5}
                  sx={{ mt: 3 }}
                >
                  <Button
                    color="inherit"
                    variant="outlined"
                    size="large"
                    onClick={handleOpenPreview}
                  >
                    Xem Trước
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      fontFamily: "Public Sans, sans-serif",
                      background: "#00AB55",
                    }}
                    loading={isSubmitting}
                  >
                    Đăng
                  </LoadingButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <PreviewDialog
        open={open}
        values={values}
        handleClose={handleClosePreview}
      />
    </>
  );
}
