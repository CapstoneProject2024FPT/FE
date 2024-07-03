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
import { useAddress } from "../../../zustand/useAddress";

// ----------------------------------------------------------------------

type Props = {
  onBackStep: VoidFunction;
};

export default function CheckoutBillingInfo({ onBackStep }: Props) {
  const { address } = useAddress();
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
          {address?.receiver}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          ></Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          {address?.phone}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {address?.fullAddress}
        </Typography>
      </CardContent>
    </Card>
  );
}
