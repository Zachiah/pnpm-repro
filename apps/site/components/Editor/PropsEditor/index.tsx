import {
  Accordion,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import {
  findNode,
  generateDataPropsSchema,
  LayoutPropsJSONSchema,
  mapObject,
  PageNode,
} from "@incmix/utils";
import produce from "immer";
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LanguageTextsManager } from "../language/LanguageTextsManager";
import { generateTranslationsForLanguageKey } from "../language/LanguageTextsUI";
import UiBuilderContext from "../UiBuilderContext";
import numberOfKeys from "./numberOfKeys";
import PropsEditorContext from "./PropsEditorContext";
import PropsForm from "./PropsForm";

const PropsEditor: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    dataSources,
    selectedPageNodeId,
    page,
    pageTreeComponentInformations,
    setPage,
    site,
  } = useContext(UiBuilderContext);

  const selectedPageNode = findNode({
    nodeId: selectedPageNodeId ?? "",
    pageNodes: page.pageTree.pageNodes,
  });

  const selectedPageNodePageComponentInformation =
    pageTreeComponentInformations.find(
      (ptci) => ptci.id === selectedPageNode?.componentId,
    );

  const pageNodeIndex = page.pageTree.pageNodes.findIndex(
    (pn) => pn.id === selectedPageNodeId,
  );

  const [dataPropsSchema, setDataPropsSchema] = useState<{
    [key: string]: any;
  }>({});

  // functions for generating the languageSchema
  const textKeys = useCallback(() => {
    return generateTranslationsForLanguageKey(site?.textDataBase ?? {}) ?? [];
  }, [site?.textDataBase]);

  const languageSchema = useMemo(() => {
    return {
      type: "object",
      required: ["textKey"],
      properties: {
        textKey: {
          type: "string",
          title: "Text Key",
          enum: textKeys().map((tk) => tk.key),
        },
      },
    } as any;
  }, [textKeys]);

  const languageFormData = useCallback(
    (props: Record<string, any>) => {
      const defaultTextKey = {
        textKey: "",
      };
      // check if props contains a key for textualProps
      if (!props?.textualProps) {
        return defaultTextKey;
      }
      // check if props.textualProps contains a key for languageKey
      if (!props?.textualProps?.text) {
        return defaultTextKey;
      }
      // check if props.textualProps.languageKey is a string
      if (typeof props?.textualProps?.text !== "string") {
        return defaultTextKey;
      }
      // TODO this might ultimately not be required.
      // check if props.textualProps.languageKey is a valid languageKey
      if (!textKeys().find((tk) => tk.key === props?.textualProps?.text)) {
        return defaultTextKey;
      }

      return {
        textKey: props?.textualProps?.text,
      };
    },
    [textKeys],
  );

  const generateLanguageFormData = (data: {
    textKey: string;
  }): Record<string, any> => {
    return {
      text: data.textKey,
    };
  };

  const closeLanguageDrawer = (e: string) => {
    setPage(
      produce(page, (draftPage) => {
        draftPage.pageTree.pageNodes[pageNodeIndex].props.textualProps = {
          text: e,
        } as any;
      }),
    );
    onClose();
  };

  useEffect(() => {
    if (selectedPageNode && selectedPageNodePageComponentInformation)
      (async () => {
        setDataPropsSchema(
          await generateDataPropsSchema({
            dataSources,
            dataProps: selectedPageNodePageComponentInformation?.dataProps,
          }),
        );
      })();
  }, [
    dataSources,
    selectedPageNode,
    selectedPageNodeId,
    selectedPageNodePageComponentInformation,
    selectedPageNodePageComponentInformation?.dataProps,
  ]);

  if (selectedPageNodeId === null) {
    return <p>Unable to find node</p>;
  }
  if (!selectedPageNode || !selectedPageNodePageComponentInformation) {
    throw new Error(
      "Something went horribly wrong. The NodeID was defined but then couldn't find the node",
    );
  }

  const handleAddNewKey = () => {
    const { textualProps } = selectedPageNode.props;
    if (numberOfKeys(textualProps) === 0) return;
    onOpen();
  };

  return (
    <PropsEditorContext.Provider
      value={{
        componentInformation: selectedPageNodePageComponentInformation,
        pageNodeIndex,
      }}
    >
      <Heading>Editing {selectedPageNodePageComponentInformation.name}</Heading>
      <Accordion allowMultiple>
        <PropsForm
          propsKey="dataProps"
          title="Data Props"
          schema={dataPropsSchema}
          formData={selectedPageNode.props.dataProps}
          transformData={(d) =>
            mapObject(
              d,
              (v) =>
                (v as PageNode["props"][keyof PageNode["props"]][string]) ?? {
                  type: "empty" as const,
                },
            )
          }
        />

        <PropsForm
          transformData={(d) => d}
          propsKey="styleProps"
          title="Style Props"
          schema={Object.fromEntries(
            selectedPageNodePageComponentInformation.styleProps.map(
              (styleProp) => [styleProp.propName, styleProp.jsonSchema],
            ),
          )}
          formData={selectedPageNode.props.styleProps}
        />

        <PropsForm
          transformData={(d) => d}
          propsKey="layoutProps"
          title="Layout Props"
          schema={LayoutPropsJSONSchema.properties}
          formData={selectedPageNode.props.layoutProps}
        />

        <PropsForm
          propsKey="textualProps"
          title="Textual Props"
          schema={languageSchema.properties}
          formData={languageFormData(selectedPageNode.props)}
          transformData={generateLanguageFormData}
        >
          <Button mt={4} onClick={handleAddNewKey}>
            Add new Key
          </Button>
        </PropsForm>
      </Accordion>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Manage Text Keys</DrawerHeader>

          <DrawerBody>
            <LanguageTextsManager
              fromDrawer
              handleDrawerClose={(e) => closeLanguageDrawer(e)}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {/* <Button colorScheme="blue">Save</Button> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </PropsEditorContext.Provider>
  );
};

export default PropsEditor;
