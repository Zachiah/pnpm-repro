import { Select } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const PageSelector: FunctionComponent = () => {
  return (
    <Select w="max-content" placeholder="Page" bg="Background">
      <option>Home (/)</option>
    </Select>
  );
};

export default PageSelector;
