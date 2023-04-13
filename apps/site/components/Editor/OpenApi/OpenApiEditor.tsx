import "swagger-ui-react/swagger-ui.css";

import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { OpenApiDefinition, parseOpenApiDefinition } from "@incmix/utils";
import Editor from "@monaco-editor/react";
import cuid from "cuid";
import produce from "immer";
import { OpenAPI } from "openapi-types";
import { FunctionComponent, useContext, useEffect, useState } from "react";
// @ts-ignore
import SwaggerUI from "swagger-ui-react";

import SimpleInput from "../SimpleInput";
import UiBuilderContext from "../UiBuilderContext";

const defaultApiDefinition = (): OpenApiDefinition => ({
  id: cuid(),
  name: "",
  format: "json",
  openApiSpec: "3.0",
});
const OpenApiEditor: FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  openApiDefinitionForEdit?: OpenApiDefinition;
}> = ({ isOpen, onClose, openApiDefinitionForEdit }) => {
  const { openApiDefinitions, setOpenApiDefinitions } =
    useContext(UiBuilderContext);
  const [openApiDefinition, setOpenApiDefinition] = useState<OpenApiDefinition>(
    openApiDefinitionForEdit ?? defaultApiDefinition(),
  );
  const [parsedSchema, setParsedSchema] = useState<
    OpenAPI.Document | undefined
  >();
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    (async function getParsed() {
      const result = await parseOpenApiDefinition(openApiDefinition);
      if (!result) setIsValid(false);
      else {
        setParsedSchema(result);
        setIsValid(true);
      }
    })();
  }, [openApiDefinition]);

  const saveDefinition = () => {
    if (isValid)
      setOpenApiDefinitions(
        produce(openApiDefinitions, (draft) => {
          const existing = draft.find(({ id }) => id === openApiDefinition.id);
          if (existing) {
            existing.name = openApiDefinition.name;
            existing.schema = openApiDefinition.schema;
            existing.format = openApiDefinition.format;
            existing.openApiSpec = openApiDefinition.openApiSpec;
            existing.parsed = parsedSchema;
          } else draft.push({ ...openApiDefinition, parsed: parsedSchema });
        }),
      );
    onClose();
    setOpenApiDefinition(defaultApiDefinition());
  };

  useEffect(() => {
    if (isOpen)
      setOpenApiDefinition(openApiDefinitionForEdit ?? defaultApiDefinition());
  }, [isOpen, openApiDefinitionForEdit]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setOpenApiDefinition(defaultApiDefinition());
        onClose();
      }}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="90%">
        <ModalHeader>Define OpenAPI Schema</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <chakra.div mb="3">
            <strong>id: </strong>
            {openApiDefinition.id}
          </chakra.div>
          <Flex gap="4">
            <Flex flexDirection="column" gap="4" flex="1">
              <FormControl>
                <SimpleInput
                  value={openApiDefinition.name}
                  setValue={(value) =>
                    setOpenApiDefinition(
                      produce(openApiDefinition, (apiDraft) => {
                        apiDraft.name = value;
                      }),
                    )
                  }
                  label="Name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>OpenApi Spec</FormLabel>
                <RadioGroup
                  value={openApiDefinition.openApiSpec}
                  onChange={(value) =>
                    setOpenApiDefinition(
                      produce(openApiDefinition, (draft) => {
                        draft.openApiSpec = value as any;
                      }),
                    )
                  }
                >
                  <Flex gap="4">
                    <Radio value="2.0">2.0</Radio>
                    <Radio value="3.0">3.0</Radio>
                    <Radio value="3.1">3.1</Radio>
                  </Flex>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="schema-editor">Schema</FormLabel>
                <Editor
                  onChange={(value) => {
                    if (value && value.length)
                      setOpenApiDefinition(
                        produce(openApiDefinition, (draft) => {
                          draft.schema = JSON.parse(value);
                        }),
                      );
                  }}
                  value={JSON.stringify(openApiDefinition.schema)}
                  language="json"
                  height="700px"
                  saveViewState
                  options={{
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    formatOnType: false,
                  }}
                  onMount={(editor: any) => {
                    editor.getAction("editor.action.formatDocument").run();
                    // setTimeout(
                    //   () => editor.updateOptions({ readOnly: true }),
                    //   1000,
                    // );
                  }}
                />
              </FormControl>
            </Flex>
            <chakra.div flex="1">
              <SwaggerUI
                spec={openApiDefinition.schema || {}}
                supportedSubmitMethods={[
                  "get",
                  "put",
                  "post",
                  "delete",
                  "options",
                  "head",
                  "patch",
                  "trace",
                ]}
              />
            </chakra.div>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              setOpenApiDefinition(defaultApiDefinition());
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            disabled={!isValid}
            onClick={() => saveDefinition()}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OpenApiEditor;
