import { Button, chakra, Flex, Spacer, Stack } from "@chakra-ui/react";
import { Icon } from "@incmix/ui";
import { OpenApiDefinition } from "@incmix/utils";
import { FunctionComponent, useContext, useState } from "react";

import UiBuilderContext from "../UiBuilderContext";
import OpenApiEditor from "./OpenApiEditor";

const ApiTab: FunctionComponent = () => {
  const { openApiDefinitions, setOpenApiDefinitions } =
    useContext(UiBuilderContext);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<
    OpenApiDefinition | undefined
  >();
  return (
    <chakra.div padding="4">
      <OpenApiEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        openApiDefinitionForEdit={selectedDefinition}
      />
      <Button
        display="flex"
        gap="1"
        colorScheme="blue"
        ml="auto"
        onClick={() => setIsEditorOpen(true)}
      >
        <Icon icon="plus" />
        <chakra.span>Add new API</chakra.span>
      </Button>
      <Stack gap="2" mt="4">
        {openApiDefinitions.map((api) => (
          <Flex key={api.id} gap="2">
            <chakra.div>{api.name}</chakra.div>
            <Spacer />
            <Button
              w="min-content"
              aria-label={`Delete open api definition ${api.name}`}
              onClick={() => {
                const definitions = openApiDefinitions.filter(
                  (d) => d.id !== api.id,
                );
                setOpenApiDefinitions(definitions);
              }}
              colorScheme="red"
            >
              <Icon icon="trash" />
            </Button>
            <Button
              w="min-content"
              aria-label={`Select datasource ${api.name}`}
              onClick={() => {
                setSelectedDefinition(api);
                setIsEditorOpen(true);
              }}
            >
              <Icon icon="pencil" />
            </Button>
          </Flex>
        ))}
      </Stack>
    </chakra.div>
  );
};

export default ApiTab;
