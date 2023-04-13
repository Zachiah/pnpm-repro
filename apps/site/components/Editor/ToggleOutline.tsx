import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { useContext, useEffect } from "react";

import UiBuilderContext from "./UiBuilderContext";

const ToggleOutline = () => {
  const { outlineMode, setOutlineMode, editMode } =
    useContext(UiBuilderContext);

  return (
    <>
      <FormControl
        isDisabled={!editMode}
        display="flex"
        alignItems="center"
        width="auto"
      >
        <FormLabel
          htmlFor="toggle-outline"
          cursor="pointer"
          mb="0"
          color="white"
        >
          Outline Mode
        </FormLabel>
        <Switch
          id="toggle-outline"
          isChecked={outlineMode}
          checked={outlineMode}
          onChange={(e) => setOutlineMode(e.currentTarget.checked)}
        />
      </FormControl>
    </>
  );
};

export default ToggleOutline;
