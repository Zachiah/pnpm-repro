import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import UiBuilderContext from "../../UiBuilderContext";
import { SingleLanguageRow } from "./SingleLanguageRow";
import { testInvalidKey, testKeyExists } from "./utils";

export const LanguageTextFormUI: FunctionComponent<{
  textKey: string | undefined;
  closeUI: (e: string) => unknown;
}> = ({ textKey, closeUI }) => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    if (mounted.current && textKey === undefined) {
      // handle the case where the user is creating a new key
      setKeyInEdit(true);
      setKey("newKey");
      setKeyFormError("Add key");
    }

    return () => {
      mounted.current = false;
    };
  }, [textKey]);

  const { site, setSite } = useContext(UiBuilderContext);

  // used to show two different inputs to either show or edit the key
  const [keyInEdit, setKeyInEdit] = useState(false);
  const [key, setKey] = useState(textKey ?? "");
  const [keyFormError, setKeyFormError] = useState<string | null>(null);

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyFormError(null);

    // check that the key does not already exist in site text database
    const textDatabase = site?.textDataBase ?? {};
    const key = e.target.value;
    if (testKeyExists(key, textDatabase)) {
      setKeyFormError("Key already exists");
    }

    // match valid char for object key
    if (testInvalidKey(key)) {
      setKeyFormError("Only text is allowed");
    }

    setKey(e.target.value);
  };

  // function loop through all the keys in the text database and get a unique list of all the languages
  const getLanguages = () => {
    const textDatabase = site?.textDataBase ?? {};
    const languages: string[] = [];
    for (const key in textDatabase) {
      if (textDatabase[key]) {
        const word = textDatabase[key];
        for (const lang in word ?? {}) {
          if (word[lang]) {
            if (!languages.includes(lang)) {
              languages.push(lang);
            }
          }
        }
      }
    }
    return languages;
  };

  // Save a new key to the text database
  const saveNewKey = () => {
    const textDataBase =
      {
        ...site?.textDataBase,
      } ?? {};

    // populate the new key with the current languages
    const languages = getLanguages();
    const newKey = key;
    const newKeyObj: Record<string, string> = {};
    languages.forEach((lang) => {
      newKeyObj[lang] = "add translation";
    });
    textDataBase[newKey] = newKeyObj;

    setSite({
      ...site,
      textDataBase,
    });
    setKeyInEdit(false);
  };

  // Save the edited key to the text database
  const saveEditedKey = () => {
    const textDatabase = site?.textDataBase ?? {};
    const newTextDatabase = { ...textDatabase };
    if (textKey) {
      newTextDatabase[key] = newTextDatabase[textKey];
      delete newTextDatabase[textKey];
    }
    setSite({ ...site, textDataBase: newTextDatabase });
    setKeyInEdit(false);
  };

  const saveKeyChange = () => {
    // TODO notify that the changing the key can be potentially very disruptive.
    // check if the key is valid otherwise return
    if (keyFormError !== null) return;

    // if textKey is undefined, then we are creating a new key
    if (textKey === undefined) {
      saveNewKey();
      return;
    }

    // replace the key in the text database
    saveEditedKey();
  };

  type LanguageText = {
    key: string;
    text: string;
  };
  // function to generate list of translations
  const generateTranslations = useCallback(() => {
    const textDatabase = site?.textDataBase ?? {};

    const word = textDatabase[key] ?? {};

    const translations: LanguageText[] = [];
    for (const lang in word ?? {}) {
      translations.push({ key: lang, text: word[lang] });
    }
    return translations;
  }, [site?.textDataBase, key]);

  const handleTranslationChange = (lang: string, text: string) => {
    const textDatabase = site?.textDataBase ?? {};
    const newTextDatabase = { ...textDatabase };
    const word = { ...newTextDatabase[key] } ?? {};
    word[lang] = text;
    newTextDatabase[key] = word;
    setSite({ ...site, textDataBase: newTextDatabase });
  };

  const [translations, setTranslations] = useState<LanguageText[]>(
    generateTranslations(),
  );

  useEffect(() => {
    setTranslations(generateTranslations());
  }, [generateTranslations, site?.textDataBase]);
  return (
    <>
      {/* UI Area for  updating and viewing textKey: {textKey} */}
      <Box>
        <HStack>
          <Text as="b">Key: </Text>
          {keyInEdit ? (
            <>
              <VStack>
                <FormControl isInvalid={keyFormError !== null}>
                  <Input
                    variant="outline"
                    placeholder={textKey ?? "key"}
                    value={key}
                    onChange={(e) => handleKeyChange(e)}
                  />
                  {keyFormError !== null && (
                    <FormErrorMessage>{keyFormError}</FormErrorMessage>
                  )}
                </FormControl>
                <Button onClick={saveKeyChange} size="sm">
                  {textKey ? "Save" : "Create"} Key
                </Button>
              </VStack>
            </>
          ) : (
            <Input
              variant="outline"
              value={key ?? ""}
              readOnly
              onClick={() => setKeyInEdit(true)}
            />
          )}
        </HStack>
        <Box>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Language</Th>
                  <Th>Text</Th>
                  <Th p={0} w="min-content" />
                </Tr>
              </Thead>
              <Tbody>
                {translations.map((translation) => (
                  <SingleLanguageRow
                    row={translation}
                    onChange={handleTranslationChange}
                    key={translation.key}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Button mt={8} size="sm" onClick={() => closeUI(key)}>
          close
        </Button>
      </Box>
    </>
  );
};
