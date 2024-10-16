import React from "react";
import { Control, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface NumericInputProps {
  control: Control<any>;
  name: string;
  disabled?: boolean;
  onValueChange?: (values: any) => void; // Allow NumericFormatValues type
}

const NumericInput: React.FC<NumericInputProps> = ({
  control,
  name,
  disabled,
  onValueChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <NumericFormat
          value={value}
          onValueChange={(values) => {
            onChange(values.value); // Handle value change
            if (onValueChange) onValueChange(values); // Call the passed onValueChange prop
          }}
          disabled={disabled}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          allowNegative={false}
          valueIsNumericString={true}
          placeholder="Enter amount"
        />
      )}
    />
  );
};

export default NumericInput;
