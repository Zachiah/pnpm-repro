import { Select } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const SiteSelector: FunctionComponent = () => {
  return (
    <Select w="max-content" placeholder="Site" bg="Background">
      <option>My First Site (my-first-site.chakra.org)</option>
    </Select>
  );
};

export default SiteSelector;
