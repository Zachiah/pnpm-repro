import { Button, ButtonGroup } from "@chakra-ui/react";
import { useContext, useEffect } from "react";

import UiBuilderContext from "./UiBuilderContext";

const SiteToolbarButtons = () => {
  const {
    editMode,
    setEditMode,
    savePage,
    undoPageModification,
    redoPageModification,
  } = useContext(UiBuilderContext);

  return (
    <ButtonGroup size="sm">
      <Button
        colorScheme="gray"
        isDisabled={undoPageModification === null}
        onClick={undoPageModification ?? undefined}
      >
        Undo
      </Button>

      <Button
        colorScheme="gray"
        isDisabled={redoPageModification === null}
        onClick={redoPageModification ?? undefined}
      >
        Redo
      </Button>

      <Button
        colorScheme={!editMode ? "green" : "gray"}
        onClick={() => setEditMode(!editMode)}
      >
        {!editMode ? "Edit" : "Preview"}
      </Button>

      <Button colorScheme="blue" onClick={savePage}>
        Save
      </Button>
    </ButtonGroup>
  );
};

export default SiteToolbarButtons;
