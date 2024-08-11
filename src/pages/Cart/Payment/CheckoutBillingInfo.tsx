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
        title="Địa chỉ giao hàng"
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
          Người nhận: {address?.namePersonal}
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{ color: "text.secondary" }}
        >
          Số điện thoại: {address?.phoneNumber}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {address?.note}, {address?.ward.name}, {address?.district.name},{" "}
          {address?.city.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
