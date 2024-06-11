import * as Yup from "yup";
import { useCallback, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { Grid, Card, Stack, Button, Typography } from "@mui/material";
// routes
// @types
import { NewPostFormValues } from "../../models/blog";
// components
import {
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../components/hook-form";
import PreviewDialog from "./BlogNewPostPreview";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import { toast } from "react-toastify";
//

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  // const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required("Phải có chủ đề").min(10, "Tối thiểu 10 từ"),
    description: Yup.string()
      .required("phải có mô tả")
      .min(10, "Tối thiểu 10 từ"),
    content: Yup.string()
      .min(200, "Tổi thiểu 200 từ")
      .required("Content is required"),
    cover: Yup.string().required("Bắt Buộc có hình"),
    image: Yup.string().required("Bắt Buộc có hình"),
  });

  const defaultValues: NewPostFormValues = {
    title: "",
    description: "",
    content: "",
    cover: "",
    image: "",
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

  const onSubmit = async (data: NewPostFormValues) => {
    try {
      toast.success("postSuccess");
      console.log(data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      console.table(data);
      reset();
      handleClosePreview();
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
    async (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];

      const ImageProduct = await uploadImageToFirebase(file);
      if (typeof ImageProduct === "string") {
        setValue("image", ImageProduct);
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                <RHFEditor simple name="content" />
              </div>
              <div>
                <LabelStyle>Ảnh</LabelStyle>
                <RHFUploadSingleFile
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDropImage}
                />
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
