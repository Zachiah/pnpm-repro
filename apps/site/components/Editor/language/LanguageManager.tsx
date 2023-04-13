import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FunctionComponent, useContext, useMemo } from "react";

import UiBuilderContext from "../UiBuilderContext";
import { generateLanguagesAvailable } from "./language.common";
import { AddNewLanguageKeyUI } from "./LanguageTextsUI/AddNewLanguageKeyUI";

export const LanguageManagerUI: FunctionComponent = () => {
  const { site } = useContext(UiBuilderContext);

  // used to manage screen for adding a new language key
  const { isOpen, onToggle } = useDisclosure();

  const generateLanguageRows = useMemo(() => {
    const langDb = site?.textDataBase ?? {};
    return generateLanguagesAvailable(langDb);
  }, [site?.textDataBase]);
  return (
    <>
      {isOpen && <AddNewLanguageKeyUI closeUI={onToggle} />}

      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Language Key</Th>
              <Th fontSize="xs">Translations count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {generateLanguageRows.map((lang) => (
              <Tr key={lang.key}>
                <Td>{lang.key}</Td>
                <Td fontSize="xs">{lang.count}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <Button
                  w="min-content"
                  aria-label="Create a new language key"
                  onClick={() => onToggle()}
                >
                  Add new key
                </Button>
              </Td>
              <Td p={0} w="min-content" />
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
