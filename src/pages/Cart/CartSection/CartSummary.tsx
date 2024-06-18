// @mui
import {
  Box,
  Card,
  Stack,
  Divider,
  CardHeader,
  Typography,
  CardContent,
} from "@mui/material";
import { formatMoney } from "../../../utils/fn";
// utils

// components

// ----------------------------------------------------------------------

type Props = {
  total: number;
};

export default function CartSummary({ total }: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Tóm tắt giỏ hàng" />

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
              Giảm giá
            </Typography>
            <Typography variant="subtitle2">0</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Phí Ship
            </Typography>
            <Typography variant="subtitle2">0</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Tổng Thành Tiền</Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                {formatMoney(total)}
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
