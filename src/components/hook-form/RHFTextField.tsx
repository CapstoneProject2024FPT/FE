import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

const formatNumberWithSpaces = (value: string) => {
  // Remove non-numeric characters
  const numericValue = value.replace(/[^\d]/g, "");
  // Format the number with spaces every three digits
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function RHFTextField({ name, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const [displayValue, setDisplayValue] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    if (other.type === "number") {
      const formattedValue = formatNumberWithSpaces(value);
      setDisplayValue(formattedValue);
      setValue(name, value.replace(/ /g, "")); // Store numeric value without spaces
    } else {
      setDisplayValue(value);
      setValue(name, value);
    }
  };

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
          value={displayValue}
          onChange={(e) => {
            handleChange(e);
            field.onChange(e);
          }}
          InputProps={{
            ...other.InputProps,
            type: "text",
            inputProps: { ...other.InputProps?.inputProps, min: 0 },
          }}
        />
      )}
    />
  );
}
