import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { NewPostFormValues } from "../../../models/blog";
import { Box, Container, Typography } from "@mui/material";
import Image from "../../../components/Image";
import EmptyContent from "../../../components/EmptyContent";

interface PreviewDialog {
  values: NewPostFormValues;
  open: boolean;
  handleClose: () => void;
}
export default function PreviewDialog({
  values,
  handleClose,
  open,
}: PreviewDialog) {
  const { title, content, description } = values;

  const cover =
    typeof values.cover === "string" ? values.cover : values.cover?.preview;

  const image =
    typeof values.image === "string" ? values.image : values.image?.preview;

  const hasContent = title || description || content || cover || image;

  const hasHero = title || cover;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        scroll="paper"
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            height: "90%",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xem Bài Viết</DialogTitle>
        <DialogContent>
          {hasContent ? (
            <>
              {hasHero && <PreviewHero title={title || ""} cover={cover} />}
              <Container>
                <Box
                  sx={{
                    mt: 5,
                    mb: 10,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 5 }}>
                    {description}
                  </Typography>
                  <Box
                    component="img"
                    display="flex"
                    alignItems="center"
                    sx={{
                      objectFit: "cover",
                      width: "80%",
                      height: "400px",
                      margin: "0 auto",
                    }}
                    alt="The house from the offer."
                    src={image}
                  />
                </Box>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </Container>
            </>
          ) : (
            <EmptyContent title="Chưa có nội dung " />
          )}
        </DialogContent>
        <DialogActions sx={{ marginRight: "5px" }}>
          <Button variant="outlined" onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ----------------------
type PreviewHeroProps = {
  title: string;
  cover?: string;
};

function PreviewHero({ title, cover }: PreviewHeroProps) {
  return (
    <Box>
      <Typography
        variant="h3"
        component="h3"
        sx={{
          color: "black",
          fontSize: "30px",
          maxWidth: "80%",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {title}
      </Typography>
      <Image alt="cover" src={cover} ratio="16/9" />
    </Box>
  );
}
