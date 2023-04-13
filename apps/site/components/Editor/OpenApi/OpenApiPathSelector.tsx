import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import {
  ApiDataSourcePath,
  ContentTypes,
  extractHosts,
  extractPaths,
  extractSecuritySchemes,
  joinApiPath,
  OpenApiDefinition,
  pathValueToDisplayName,
  splitApiPath,
  stringToHttpMethod,
} from "@incmix/utils";
import produce from "immer";
import { FunctionComponent, useId, useMemo, useState } from "react";

import ApiTester from "./ApiTester";

const OpenApiPathSelector: FunctionComponent<{
  label: string;
  apiPath: ApiDataSourcePath | null;
  setApiPath: (apiPath: ApiDataSourcePath | null) => void;
  selectedOpenApiDefinition?: OpenApiDefinition;
}> = ({ label, apiPath, setApiPath, selectedOpenApiDefinition }) => {
  const [testerIsOpen, setTesterIsOpen] = useState(false);

  const availablePaths = useMemo<string[]>(() => {
    if (!selectedOpenApiDefinition) return [];
    return extractPaths(selectedOpenApiDefinition);
  }, [selectedOpenApiDefinition]);

  const availableHosts = useMemo<string[]>(() => {
    if (!selectedOpenApiDefinition || !apiPath) return [];
    return extractHosts(selectedOpenApiDefinition, apiPath);
  }, [selectedOpenApiDefinition, apiPath]);

  const availableSecurities = useMemo(() => {
    if (!selectedOpenApiDefinition || !apiPath) return [];
    return extractSecuritySchemes(selectedOpenApiDefinition, apiPath);
  }, [selectedOpenApiDefinition, apiPath]);

  const id = useId();
  return (
    <Flex
      direction="column"
      gap={4}
      border="1px solid"
      borderColor="gray.400"
      rounded="md"
      p={2}
    >
      <chakra.h2 fontSize="lg">{label}</chakra.h2>
      <chakra.hr mb={4} />
      <FormControl display="flex">
        <FormLabel htmlFor={`webApiTemplate-${id}-enable`}>Enable</FormLabel>
        <Spacer />
        <Switch
          id={`webApiTemplate-${id}-enable`}
          isChecked={!!apiPath}
          onInput={() => {
            if (apiPath) {
              setApiPath(null);
            } else {
              setApiPath({
                host: availableHosts[0],
                method: stringToHttpMethod(
                  splitApiPath(availablePaths[0]).method,
                ),
                name: splitApiPath(availablePaths[0]).pathName,
                openApiPathName: splitApiPath(availablePaths[0]).pathName,
                contentType: "application/json",
                outputJsonPath: "",
                openApiDefinitionId: selectedOpenApiDefinition?.id,
              });
            }
          }}
        />
      </FormControl>
      {apiPath && (
        <>
          <FormControl>
            <FormLabel htmlFor={`${id}_openapi-path-selector`}>
              Select OpenApi Path
            </FormLabel>
            <Select
              value={joinApiPath(apiPath.name, apiPath.method)}
              onChange={(e) =>
                setApiPath(
                  produce(apiPath, (draftPath) => {
                    const { pathName, method } = splitApiPath(
                      e.currentTarget.value,
                    );
                    draftPath.name = pathName;
                    draftPath.openApiPathName = pathName;
                    draftPath.method = stringToHttpMethod(method);
                  }),
                )
              }
            >
              {availablePaths.map((path) => (
                <option value={path} key={path}>
                  {pathValueToDisplayName(path)}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={`${id}_openapi-host-selector`}>
              Select Host
            </FormLabel>
            <Select
              value={apiPath.host}
              onChange={(e) =>
                setApiPath(
                  produce(apiPath, (draftPath) => {
                    if (e.currentTarget.value !== "none")
                      draftPath.host = e.currentTarget.value;
                    else draftPath.host = "";
                  }),
                )
              }
            >
              <option value="none">None</option>
              {availableHosts.map((host) => (
                <option value={host} key={`host__${host}`}>
                  {host}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={`${id}_openapi-host-selector`}>
              Select Security Scheme
            </FormLabel>
            <Select
              multiple
              value={
                (apiPath.security?.map<string>(({ name }) => name) ??
                  []) as string[]
              }
              onChange={(e) => {
                const select = e.currentTarget as HTMLSelectElement;
                const selected = [...select.options]
                  .filter((option) => option.selected)
                  .map((option) => option.value);
                setApiPath(
                  produce(apiPath, (draftPath) => {
                    draftPath.security = selected.map((opt) => {
                      return availableSecurities.find(
                        ({ name }) => name === opt,
                      )!;
                    });
                  }),
                );
              }}
            >
              {availableSecurities.map((security) => (
                <option
                  value={security.name}
                  key={`security__${security.name}`}
                >
                  {`${security.name} (${security.type})`}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={`${id}_content-type-selector`}>
              Select Content Type
            </FormLabel>
            <Select
              value={`${apiPath?.contentType}`}
              onChange={(e) =>
                setApiPath(
                  produce(apiPath, (draftPath) => {
                    if (e.currentTarget.value === "none")
                      draftPath.contentType = undefined;
                    else draftPath.contentType = e.currentTarget.value;
                  }),
                )
              }
            >
              <option value="none">None</option>
              {ContentTypes.map((contentType) => (
                <option
                  value={contentType}
                  key={`${apiPath.name}__${contentType}`}
                >
                  {contentType}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={`${id}_output-json-path`}>
              Output JSON Path
            </FormLabel>
            <Input
              id={`${id}_output-json-path`}
              value={apiPath.outputJsonPath}
              onInput={(e) =>
                setApiPath(
                  produce(apiPath, (draftPath) => {
                    draftPath.outputJsonPath = e.currentTarget.value;
                  }),
                )
              }
            />
          </FormControl>
          <Button
            disabled={
              !apiPath.openApiPathName ||
              !apiPath.openApiPathName.length ||
              !apiPath.host ||
              !apiPath.host.length ||
              !selectedOpenApiDefinition
            }
            onClick={() => setTesterIsOpen(true)}
          >
            Test API
          </Button>
          <ApiTester
            isOpen={testerIsOpen}
            onClose={() => setTesterIsOpen(false)}
            openApiDefinition={selectedOpenApiDefinition}
            selectedPath={apiPath}
          />
        </>
      )}
    </Flex>
  );
};

export default OpenApiPathSelector;
