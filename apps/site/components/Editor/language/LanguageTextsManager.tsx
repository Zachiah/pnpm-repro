import {
  Button,
  Fade,
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
import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import UiBuilderContext from "../UiBuilderContext";
import {
  generateTranslationsForLanguageKey,
  LanguageTextFormUI,
} from "./LanguageTextsUI";

type LanguageTextsManagerProps = {
  fromDrawer?: boolean;
  handleDrawerClose?: (e: string) => unknown;
};

export const LanguageTextsManager: FunctionComponent<
  LanguageTextsManagerProps
> = (props: LanguageTextsManagerProps) => {
  const { site } = useContext(UiBuilderContext);
  const [keyToEdit, setKeyToEdit] = useState<string | undefined>(undefined);
  const { isOpen, onToggle } = useDisclosure();

  const generateTranslationsRows = useMemo(() => {
    const langDb = site?.textDataBase ?? {};
    return generateTranslationsForLanguageKey(langDb);
  }, [site?.textDataBase]);

  const handleKeyEdit = (key: string) => {
    setKeyToEdit(key);
    onToggle();
  };

  const handleCreateNewKey = () => {
    setKeyToEdit(undefined);
    onToggle();
  };
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    if (mounted) {
      if (props?.fromDrawer) {
        handleCreateNewKey();
      }
    }
    return () => {
      mounted.current = false;
    };
    // adding the dependencies eslint complains about causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseUI = (e: string) => {
    if (props?.fromDrawer) {
      props?.handleDrawerClose?.(e);
    } else {
      onToggle();
    }
  };
  return (
    <>
      {isOpen && (
        <Fade in={isOpen}>
          <LanguageTextFormUI
            textKey={keyToEdit}
            closeUI={(e) => handleCloseUI(e)}
          />
        </Fade>
      )}

      {!isOpen && (
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Languages</Th>
                <Th p={0} w="min-content" />
              </Tr>
            </Thead>
            <Tbody>
              {generateTranslationsRows.map((row) => (
                <Tr key={row.key}>
                  <Td w="full">{row.key}</Td>
                  <Td w="full">{row.languages.join(", ")}</Td>
                  <Td
                    p={0}
                    w="min-content"
                    onClick={() => handleKeyEdit(row.key)}
                    cursor="pointer"
                  >
                    Manage
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td>
                  <Button
                    w="min-content"
                    aria-label="Create a new language key"
                    onClick={() => handleCreateNewKey()}
                  >
                    Add new key
                  </Button>
                </Td>
                <Td p={0} w="min-content" />
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
