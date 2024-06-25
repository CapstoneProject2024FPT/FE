// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  Radio,
  Stack,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";
// hooks

// @types
import { PaymentOption } from "../../../models/payment";
// components
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const OptionStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2.5),
  justifyContent: "space-between",
  transition: theme.transitions.create("all"),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

type Props = {
  paymentOptions: PaymentOption[];
};

export default function CheckoutPaymentMethods({ paymentOptions }: Props) {
  const { control } = useFormContext();

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Phương Thức Thanh Toán" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {paymentOptions.map((method) => {
                    const { value, title, description } = method;

                    const selected = field.value === value;

                    return (
                      <OptionStyle
                        key={title}
                        sx={{
                          ...(selected && {
                            boxShadow: "5px 10px #888888",
                          }),
                        }}
                      >
                        <FormControlLabel
                          value={value}
                          control={
                            <Radio
                              checkedIcon={
                                <Iconify icon={"eva:checkmark-circle-2-fill"} />
                              }
                            />
                          }
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle2">
                                {title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {description}
                              </Typography>
                            </Box>
                          }
                          sx={{ flexGrow: 1, py: 3 }}
                        />
                      </OptionStyle>
                    );
                  })}
                </Stack>
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
