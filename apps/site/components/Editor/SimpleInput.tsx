import { FormLabel, Input, InputGroup } from "@chakra-ui/react";
import { FunctionComponent, useId } from "react";

const SimpleInput: FunctionComponent<{
  value: string;
  setValue: (newValue: string) => void;
  label: string;
  Component?: (p: {
    value: string;
    onChange: (e: { currentTarget: { value: string } }) => void;
    id: string;
  }) => JSX.Element;
}> = ({ value, setValue, label, Component = Input }) => {
  const id = useId();
  return (
    <InputGroup>
      <FormLabel htmlFor={`simple-input-${id}`}>{label}</FormLabel>
      <Component
        id={`simple-input-${id}`}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </InputGroup>
  );
};

export default SimpleInput;
