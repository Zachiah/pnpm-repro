import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Text,
} from "@chakra-ui/react";
import cuid from "cuid";
import React from "react";

import { InputFieldProps } from "./types";

export const InputField: React.FC<InputFieldProps> = ({
  name,
  errors,
  label,
  setValue,
  isRequired,
  ...props
}) => {
  return (
    <FormControl isRequired={isRequired}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        id={name}
        onChange={(e) => setValue(e.currentTarget.value)}
        required={isRequired}
        {...props}
      />
      {errors?.map((error) => (
        <Text color="red" fontSize="sm" key={`${name}_error_${cuid()}`}>
          {error}
        </Text>
      ))}
    </FormControl>
  );
};
