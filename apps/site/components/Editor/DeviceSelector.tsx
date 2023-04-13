import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FaDesktop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";

const DeviceSelector: FunctionComponent = () => {
  return (
    <ButtonGroup isAttached size="sm">
      <IconButton aria-label="View site on mobile" icon={<FaMobileAlt />} />
      <IconButton aria-label="View site on tablet" icon={<FaTabletAlt />} />
      <IconButton
        aria-label="View site on desktop"
        disabled
        icon={<FaDesktop />}
      />
    </ButtonGroup>
  );
};

export default DeviceSelector;
