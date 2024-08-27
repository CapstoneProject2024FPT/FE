// @mui
import {
  Box,
  Card,
  Stack,
  Divider,
  CardHeader,
  Typography,
  CardContent,
  Button,
} from "@mui/material";
import { formatMoney } from "../../../utils/fn";
import Iconify from "../../../components/Iconify";
import { userModel } from "../../../models/UserData";
// utils

// components

// ----------------------------------------------------------------------

type Props = {
  total: number;
  discount: number;
  enableEdit?: boolean;
  onEdit?: VoidFunction;
  customer: userModel | null;
};

export default function CartSummary({
  total,
  enableEdit,
  onEdit,
  discount,
  customer,
}: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <Card sx={{ p: 3 }}>
        <CardHeader title="Mức giảm cho người dùng" />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Hạng người dùng:
              </Typography>
              <Typography variant="subtitle2">
                {customer?.rank?.name}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Mức ưu đãi áp dụng
              </Typography>
              <Typography variant="subtitle2">
                {customer?.rank?.value ? `${customer.rank.value}%` : ""}
              </Typography>
            </Stack>

            <Divider />
          </Stack>
        </CardContent>
      </Card>
      <CardHeader
        title="Tóm tắt giỏ hàng"
        action={
          enableEdit && (
            <Button
              size="small"
              onClick={onEdit}
              startIcon={<Iconify icon={"eva:edit-fill"} />}
            >
              Sửa
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Tạm tính:
            </Typography>
            <Typography variant="subtitle2">{formatMoney(total)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Giảm giá theo hạng
            </Typography>
            <Typography variant="subtitle2">{formatMoney(discount)}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Tổng Thành Tiền</Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                {formatMoney(total - discount)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                (Đã bao gồm thuế VAT)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
