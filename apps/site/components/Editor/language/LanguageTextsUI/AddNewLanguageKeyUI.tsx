import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
} from "@chakra-ui/react";
import { FunctionComponent, useContext, useState } from "react";

import UiBuilderContext from "../../UiBuilderContext";

export const AddNewLanguageKeyUI: FunctionComponent<{
  closeUI: () => void;
}> = ({ closeUI }) => {
  const { site, setSite } = useContext(UiBuilderContext);
  const [newLanguageKey, setNewLanguageKey] = useState("");
  const [newLanguageKeyError, setNewLanguageKeyError] = useState<string | null>(
    null,
  );

  const handleCreateNewLanguageKey = () => {
    setNewLanguageKeyError(null);

    if (!site) {
      throw new Error("UiBuilderContext is needed to render this component.");
    }
    if (newLanguageKey === "") {
      setNewLanguageKeyError("Key cannot be empty");

      return;
    }

    // check if newLanguageKey can be used as an object key
    if (!/^[a-zA-Z0-9_]+$/.test(newLanguageKey)) {
      setNewLanguageKeyError(
        "Key can only contain letters, numbers and underscores",
      );

      return;
    }

    const textDataBase = { ...site.textDataBase } ?? {};

    // loop through the text database and check if the key already exists in one of the objects
    for (const key in textDataBase) {
      if (textDataBase[key]) {
        const element = textDataBase[key];
        if (element[newLanguageKey]) {
          setNewLanguageKeyError("Language Key already exists");
          return;
        }
      }
    }

    // if the key does not exist in any of the objects, add it to all the objects in the text database
    for (const key in textDataBase) {
      if (textDataBase[key]) {
        const element = { ...textDataBase[key] };
        element[newLanguageKey] = "";
        textDataBase[key] = element;
      }
    }
    // update site.textDataBase
    setSite({ ...site, textDataBase });
    closeUI();
  };
  return (
    <>
      <Box>
        <HStack>
          <FormControl isInvalid={newLanguageKeyError !== null}>
            <Input
              placeholder="Add Language Key"
              value={newLanguageKey}
              onChange={(e) => setNewLanguageKey(e.target.value)}
              variant="outline"
            />
            {setNewLanguageKeyError !== null && (
              <FormErrorMessage>{newLanguageKeyError}</FormErrorMessage>
            )}
          </FormControl>

          <Button onClick={handleCreateNewLanguageKey}>Add</Button>
        </HStack>
      </Box>
    </>
  );
};
