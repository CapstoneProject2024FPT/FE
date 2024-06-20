// @mui
import {
  Card,
  Button,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";

// components
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

type Props = {
  onBackStep: VoidFunction;
};

export default function CheckoutBillingInfo({ onBackStep }: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Địa chỉ hoá đơn"
        action={
          <Button
            size="small"
            startIcon={<Iconify icon={"eva:edit-fill"} />}
            onClick={onBackStep}
          >
            Sửa
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          ffff
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            ffff
          </Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          fffff
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          fddfdf
        </Typography>
      </CardContent>
    </Card>
  );
}
