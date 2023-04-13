import { InputProps } from "@chakra-ui/react";

export interface InputFieldProps extends InputProps {
  label?: string;
  errors?: string[];
  value: string;
  setValue: (value: string) => void;
}
