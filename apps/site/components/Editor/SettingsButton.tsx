import { SettingsIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useContext } from "react";

import UiBuilderContext from "./UiBuilderContext";

const SettingsButton = () => {
  const { onToggle } = useContext(UiBuilderContext);
  return (
    <IconButton
      colorScheme="blue"
      fontSize="32px"
      aria-label="toggle search"
      onClick={onToggle}
      icon={<SettingsIcon />}
      _active={{
        colorScheme: "teal",
      }}
    />
  );
};

export default SettingsButton;
