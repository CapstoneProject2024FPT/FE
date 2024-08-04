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
// components
import Iconify from "../../../components/Iconify";
import { addressProps } from "../../../models/address";
import { formatAddress } from "../../../utils/fn";

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
  addressOption: addressProps[];
};

export default function AddressButon({ addressOption }: Props) {
  const { control } = useFormContext();
  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Địa chỉ giao hàng" />
      <CardContent>
        <Controller
          name="idAddress"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {addressOption.map((address) => {
                    const { id } = address;
                    const selected = field.value === id;

                    return (
                      <OptionStyle
                        key={id}
                        sx={{
                          ...(selected && {
                            boxShadow: "5px 10px #888888",
                          }),
                        }}
                      >
                        <FormControlLabel
                          value={id}
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
                                {" "}
                                Tên người nhận: {address.namePersonal}
                              </Typography>
                              <Typography variant="subtitle2">
                                {" "}
                                Số điện thoại: {address.phoneNumber}
                              </Typography>
                              <Typography variant="subtitle2">
                                {" "}
                                Tên địa chỉ: {address.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {formatAddress(address)}
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
