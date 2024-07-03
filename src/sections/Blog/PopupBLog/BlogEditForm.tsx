import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { Grid, Card, Stack, Typography, Box, IconButton } from "@mui/material";
// routes
// @types
import { NewUpdateFormValues, PostGetProps } from "../../../models/blog";
// components
import {
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFSelect,
} from "../../../components/hook-form";
import uploadImageToFirebase from "../../../firebase/uploadImageToFirebase";
import { toast } from "react-toastify";
import { NewsCategoryProps } from "../../../models/newCategories";
import { ApiNewsCategories } from "../../../api/services/apiNewsCategories";
import { ApiNews } from "../../../api/services/apiNews";
import CloseIcon from "@mui/icons-material/Close";
//

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
interface BLogUpdate {
  blogDetail: PostGetProps | undefined;
  openUpdate: boolean;
  handleClose: VoidFunction;
  onUpdateSuccess: () => void;
}

interface NewUpdateForm {
  title: string;
  description: string;
  newsContent: string;
  cover: string;
  newsCategoryId: string;
}

const BlogNewUpdateForm: React.FC<BLogUpdate> = ({
  blogDetail,
  openUpdate,
  handleClose,
  onUpdateSuccess,
}) => {
  // const navigate = useNavigate();
  const [newsCategories, setNewsCategories] = useState<NewsCategoryProps[]>([]);
  const { getNewsCategoriesAvailable } = ApiNewsCategories();
  const { apiUpdateNewsDetail } = ApiNews();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required("Phải có chủ đề").min(10, "Tối thiểu 10 từ"),
    description: Yup.string()
      .required("phải có mô tả")
      .min(10, "Tối thiểu 10 từ"),
    newsContent: Yup.string()
      .min(200, "Tổi thiểu 200 từ")
      .required("Content is required"),
    cover: Yup.string().required("Bắt Buộc có hình"),
    newsCategoryId: Yup.string().required("Bắt chọn loại tin tức"),
  });

  const defaultValues = {
    title: blogDetail?.title || "",
    description: blogDetail?.description || "",
    newsContent: blogDetail?.newsContent || "",
    cover: blogDetail?.cover || "",
    newsCategoryId: blogDetail?.newsCategory.newsCategoryId || "",
  };

  const methods = useForm<NewUpdateForm>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
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

  const onSubmit = async (data: NewUpdateForm) => {
    try {
      if (blogDetail) {
        const params: NewUpdateFormValues = {
          ...data,
          status: blogDetail.status,
          type: blogDetail.type,
        };
        const response = await apiUpdateNewsDetail(blogDetail?.id, params);
        if (response.status === 200) {
          onUpdateSuccess();
          reset();
        } else {
          toast.error("Xảy ra lỗi trong quá trình chỉnh sửa");
        }
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
  return (
    <>
      {openUpdate && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              background: "white",
              border: "1px solid #ccc",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "1000px",
              maxHeight: "80%",
              overflowY: "auto",
              padding: "50px",
              borderRadius: "5px",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "fixed", top: "10px", right: "10px" }}
            >
              <CloseIcon />
            </IconButton>
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
                        <LabelStyle>Nội dung</LabelStyle>
                        <RHFEditor simple name="newsContent" />
                      </div>
                      <div>
                        <LabelStyle>Hình nền</LabelStyle>
                        <RHFUploadSingleFile
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
                          Cập nhật
                        </LoadingButton>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
          </div>
        </>
      )}
    </>
  );
};

export default BlogNewUpdateForm;
