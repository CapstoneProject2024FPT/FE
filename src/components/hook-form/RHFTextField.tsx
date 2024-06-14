// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField, TextFieldProps } from "@mui/material";

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export default function RHFTextField({ name, ...other }: Props) {
  const { control, getValues } = useFormContext();
  const fieldType = other.type || "text"; // Default type is "text"

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
          value={
            fieldType === "number"
              ? getValues(name)?.toLocaleString() || ""
              : field.value || "" // Ensure non-number fields have default empty value
          }
        />
      )}
    />
  );
}
