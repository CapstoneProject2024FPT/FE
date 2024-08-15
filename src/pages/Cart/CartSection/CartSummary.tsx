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
// utils

// components

// ----------------------------------------------------------------------

type Props = {
  total: number;
  discount: number;
  enableEdit?: boolean;
  onEdit?: VoidFunction;
};

export default function CartSummary({
  total,
  enableEdit,
  onEdit,
  discount,
}: Props) {
  return (
    <Card sx={{ mb: 3 }}>
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
