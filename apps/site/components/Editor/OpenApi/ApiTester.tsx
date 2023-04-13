import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ApiDataSourcePath,
  generateApiRequest,
  HttpMethod,
  OpenApiDefinition,
} from "@incmix/utils";
import produce from "immer";
import dynamic from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const ApiTester: FunctionComponent<{
  openApiDefinition?: OpenApiDefinition;
  selectedPath: ApiDataSourcePath;
  isOpen: boolean;
  onClose: () => void;
}> = ({ openApiDefinition, selectedPath, isOpen, onClose }) => {
  const request = useMemo(() => {
    return generateApiRequest(openApiDefinition!, selectedPath);
  }, [openApiDefinition, selectedPath]);

  // Query Params
  const [queryParams, setQueryParams] = useState(request.queryParams);
  const queryString = useMemo(() => {
    return queryParams.reduce((acc, curr, index) => {
      const value = curr.value?.toString();
      if (value && value.length) {
        if (acc.length) return `${acc}&${curr.name}=${value}`;

        return `${acc}${curr.name}=${value}`;
      }
      return acc;
    }, "");
  }, [queryParams]);

  useEffect(() => {
    setQueryParams(request.queryParams);
  }, [request]);

  // Path Params
  const [pathParams, setPathParams] = useState(request.pathParams);
  const pathString = useMemo(() => {
    return pathParams.reduce((acc, curr, index) => {
      const value = curr.value?.toString();
      if (value && value.length) {
        return acc.replace(`{${curr.name}}`, value);
      }
      return acc;
    }, request.path);
  }, [pathParams, request.path]);

  useEffect(() => {
    setPathParams(request.pathParams);
  }, [request.pathParams]);

  // Headers
  const [requestHeaders, setRequestHeaders] = useState(request.headers);
  const headers = useMemo(() => {
    const headerParams = new Headers();
    requestHeaders.forEach((h) => {
      headerParams.append(h.name, h.value?.toString() ?? "");
    });
    return headerParams;
  }, [requestHeaders]);

  useEffect(() => {
    setRequestHeaders(request.headers);
  }, [request.headers]);

  // Result
  const [result, setResult] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const executeRequest = async () => {
    setResult(undefined);
    setError(null);
    setLoading(true);
    const url = `${request.host}${pathString}${
      queryString.length ? "?" : ""
    }${queryString}`;
    if (
      (request.method === HttpMethod.post ||
        request.method === HttpMethod.put ||
        request.method === HttpMethod.patch) &&
      request.contentType
    )
      headers.append("Content-Type", request.contentType);
    try {
      const resp = await fetch(url, {
        method: request.method,
        headers,
      });
      if (resp.status === 200 || resp.status === 201) {
        const json = await resp.json();
        setResult(json);
      } else {
        setError(
          `${resp.status}: ${
            resp.statusText.length ? resp.statusText : "error"
          }`,
        );
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(`${err.name}: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="90%" minH="90vh">
        <ModalHeader>Define OpenAPI Schema</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {openApiDefinition ? (
            <Flex direction="column" gap="6">
              <Flex alignItems="center" gap="4">
                <Badge colorScheme="green">{selectedPath.method}</Badge>
                <Text>{selectedPath.host + selectedPath.openApiPathName}</Text>
              </Flex>
              <Tabs>
                <TabList>
                  <Tab fontSize="xs">Query Parameters</Tab>
                  <Tab fontSize="xs">Path Parameters</Tab>
                  <Tab fontSize="xs">Headers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {queryParams.length > 0 ? (
                      <VStack>
                        <Text>Query String: ?{queryString} </Text>
                        {queryParams.map((q, index) => (
                          <FormControl key={q.name} isRequired={q.required}>
                            <FormLabel htmlFor={q.name}>{q.name}</FormLabel>
                            <Input
                              value={q.value?.toString()}
                              onChange={(e) => {
                                setQueryParams(
                                  produce(queryParams, (draftParams) => {
                                    draftParams[index].value =
                                      e.currentTarget.value;
                                  }),
                                );
                              }}
                            />
                          </FormControl>
                        ))}
                      </VStack>
                    ) : (
                      <Text>No query params found in this request</Text>
                    )}
                  </TabPanel>
                  <TabPanel>
                    {pathParams.length > 0 ? (
                      <VStack>
                        <Text>Path: {pathString} </Text>
                        {pathParams.map((q, index) => (
                          <FormControl key={q.name} isRequired={q.required}>
                            <FormLabel htmlFor={q.name}>{q.name}</FormLabel>
                            <Input
                              value={q.value?.toString()}
                              onChange={(e) => {
                                setPathParams(
                                  produce(pathParams, (draftParams) => {
                                    draftParams[index].value =
                                      e.currentTarget.value;
                                  }),
                                );
                              }}
                            />
                          </FormControl>
                        ))}
                      </VStack>
                    ) : (
                      <Text>No path params found in this request</Text>
                    )}
                  </TabPanel>
                  <TabPanel>
                    <VStack>
                      <FormControl>
                        <FormLabel>Content type</FormLabel>
                        <Input
                          value={request.contentType ?? "default"}
                          disabled
                        />
                      </FormControl>
                      {requestHeaders.map((q, index) => (
                        <FormControl key={q.name} isRequired={q.required}>
                          <FormLabel htmlFor={q.name}>{q.name}</FormLabel>
                          <Input
                            value={q.value?.toString()}
                            onChange={(e) => {
                              setRequestHeaders(
                                produce(requestHeaders, (draftParams) => {
                                  draftParams[index].value =
                                    e.currentTarget.value;
                                }),
                              );
                            }}
                          />
                        </FormControl>
                      ))}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <Button onClick={() => executeRequest()}>Execute</Button>
              {loading && <Spinner size="md" />}
              {result && (
                <DynamicReactJson enableClipboard={false} src={result} />
              )}
              {error && <Text color="red">{error}</Text>}
            </Flex>
          ) : (
            <div>Please select open api definition</div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApiTester;
