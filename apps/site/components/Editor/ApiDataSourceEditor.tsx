import {
  chakra,
  FormControl,
  FormLabel,
  Select,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import { JsonEditor } from "@incmix/ui";
import {
  ApiDataSource,
  extractJsonSchemas,
  OpenApiDefinition,
  useJsonString,
  useModifiedUseState,
} from "@incmix/utils";
import { JSONSchema } from "json-schema-to-ts";
import { FunctionComponent, useContext, useEffect, useMemo } from "react";

import ApiPanelBottomSubmitButton from "./ApiPanelBottomSubmitButton";
import OpenApiPathSelector from "./OpenApi/OpenApiPathSelector";
import SimpleInput from "./SimpleInput";
import UiBuilderContext from "./UiBuilderContext";

const ApiDataSourceEditor: FunctionComponent<{
  apiDataSource: ApiDataSource;
  setApiDataSource: (newApiDataSource: ApiDataSource) => void;
}> = ({ apiDataSource, setApiDataSource }) => {
  const { useModifiedState, modified } = useModifiedUseState();

  const [type, setType] = useModifiedState(apiDataSource.type);
  const [name, setName] = useModifiedState(apiDataSource.name);
  const [selectedOpenApiDefinitionId, setSelectedOpenApiDefinitionId] =
    useModifiedState(apiDataSource.openApiDefinitionId);

  const [createApi, setCreateApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "collection" }).createApi,
  );
  const [updateApi, setUpdateApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "collection" }).updateApi,
  );
  const [readApi, setReadApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "collection" }).readApi,
  );
  const [indexApi, setIndexApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "collection" }).indexApi,
  );
  const [deleteApi, setDeleteApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "collection" }).deleteApi,
  );

  const [setApi, setSetApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "scalar" }).setApi,
  );
  const [getApi, setGetApi] = useModifiedState(
    (apiDataSource as typeof apiDataSource & { type: "scalar" }).getApi,
  );

  const { openApiDefinitions } = useContext(UiBuilderContext);

  const selectedOpenApiDefinition = useMemo<OpenApiDefinition | undefined>(
    () =>
      openApiDefinitions.find(({ id }) => id === selectedOpenApiDefinitionId),
    [openApiDefinitions, selectedOpenApiDefinitionId],
  );

  const availableJsonSchemas = useMemo<
    { name: string; schema: JSONSchema }[]
  >(() => {
    if (!selectedOpenApiDefinition) return [];
    return extractJsonSchemas(selectedOpenApiDefinition);
  }, [selectedOpenApiDefinition]);

  const jsonSchema = useJsonString(apiDataSource.jsonSchema.schema);
  const [selectedJsonSchema, setSelectedJsonSchema] = useModifiedState(
    apiDataSource.jsonSchema,
  );
  const [modifiedJson, setModifiedJson] = useModifiedState(jsonSchema.string);

  useEffect(() => {
    setModifiedJson(jsonSchema.string);
  }, [jsonSchema.string, setModifiedJson]);

  return (
    <>
      <chakra.form
        p={4}
        pb={20}
        display="flex"
        flexDirection="column"
        gap={4}
        onSubmit={(e) => {
          e.preventDefault();

          // TODO: Tell the user why it ain't working
          if (!jsonSchema.valid) return;

          setApiDataSource({
            type,
            name,
            id: apiDataSource.id,
            jsonSchema: {
              name: selectedJsonSchema.name,
              schema: jsonSchema.value,
            },
            createApi,
            updateApi,
            readApi,
            indexApi,
            deleteApi,
            setApi,
            getApi,
            dsType: "api",
            openApiDefinitionId: selectedOpenApiDefinitionId,
          });
        }}
      >
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor={`adse-control-${apiDataSource.id}_type`}>
            Collection
          </FormLabel>
          <Spacer />
          <Switch
            id={`adse-control-${apiDataSource.id}_type`}
            isChecked={type === "collection"}
            onInput={(e) => {
              const newType = type === "scalar" ? "collection" : "scalar";
              setType(newType);
            }}
          />
        </FormControl>
        <SimpleInput value={name} setValue={setName} label="Name" />
        <FormControl>
          <FormLabel htmlFor={`${apiDataSource.id}_openapi-selector`}>
            Select OpenApi Definition
          </FormLabel>
          <Select
            id={`${apiDataSource.id}_openapi-selector`}
            value={selectedOpenApiDefinitionId}
            onChange={(e) => {
              setSelectedOpenApiDefinitionId(e.currentTarget.value);
            }}
          >
            <option>None</option>
            {openApiDefinitions.map((api) => (
              <option value={api.id} key={`openapi-${api.id}`}>
                {api.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor={`${apiDataSource.id}_schema-selector`}>
            Select Json Schema
          </FormLabel>
          <Select
            id={`${apiDataSource.id}_schema-selector`}
            value={selectedJsonSchema.name}
            onChange={(e) => {
              const schema = availableJsonSchemas.find(
                (s) => s.name === e.currentTarget.value,
              );

              if (!schema) {
                setSelectedJsonSchema({
                  name: e.currentTarget.value,
                  schema: {},
                });
                jsonSchema.setString("{}");
              } else {
                setSelectedJsonSchema(schema);
                jsonSchema.setString(JSON.stringify(schema.schema));
              }
            }}
          >
            <option value="custom">Custom</option>
            {availableJsonSchemas.map((schema) => (
              <option value={schema.name} key={`openapi-${schema.name}`}>
                {schema.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <JsonEditor label="Json Schema" usedJsonString={jsonSchema} />
        {type === "collection" ? (
          <>
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={indexApi}
              setApiPath={setIndexApi}
              label="Index Api"
            />
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={readApi}
              setApiPath={setReadApi}
              label="Read Api"
            />
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={deleteApi}
              setApiPath={setDeleteApi}
              label="Delete Api"
            />
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={updateApi}
              setApiPath={setUpdateApi}
              label="Update Api"
            />
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={createApi}
              setApiPath={setCreateApi}
              label="Create Api"
            />
          </>
        ) : (
          <>
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={getApi}
              setApiPath={setGetApi}
              label="Get Api"
            />
            <OpenApiPathSelector
              selectedOpenApiDefinition={selectedOpenApiDefinition}
              apiPath={setApi}
              setApiPath={setSetApi}
              label="Set Api"
            />
          </>
        )}

        <ApiPanelBottomSubmitButton hasChanges={modified} />
      </chakra.form>
    </>
  );
};

export default ApiDataSourceEditor;
