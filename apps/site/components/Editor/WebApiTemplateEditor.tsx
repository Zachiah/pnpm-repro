import {
  chakra,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { WebApiTemplate } from "@incmix/utils";
import { FunctionComponent, useId } from "react";

const WebApiTemplateEditor: FunctionComponent<{
  webApiTemplate: WebApiTemplate | null;
  setWebApiTemplate: (newWebApiTemplate: WebApiTemplate | null) => void;
  label: string;
}> = ({ webApiTemplate, setWebApiTemplate, label }) => {
  const id = useId();
  return (
    <FormControl
      display="flex"
      flexDirection="column"
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
          isChecked={!!webApiTemplate}
          onInput={() => {
            if (webApiTemplate) {
              setWebApiTemplate(null);
            } else {
              setWebApiTemplate({
                method: "GET",
                outputJsonPath: "",
                url: "",
              });
            }
          }}
        />
      </FormControl>
      {webApiTemplate && (
        <>
          <FormControl display="flex" flexDirection="column">
            <FormLabel htmlFor={`webApiTemplate-${id}-url`}>Url</FormLabel>
            <Input
              id={`webApiTemplate-${id}-url`}
              value={webApiTemplate.url}
              onInput={(e) => {
                setWebApiTemplate({
                  ...webApiTemplate,
                  url: e.currentTarget.value,
                });
              }}
            />
          </FormControl>
          <FormControl display="flex" flexDirection="column">
            <FormLabel htmlFor={`webApiTemplate-${id}-method`}>
              Method
            </FormLabel>
            <RadioGroup
              id={`webApiTemplate-${id}-method`}
              onChange={(value) => {
                setWebApiTemplate({
                  ...webApiTemplate,
                  method: value as "POST" | "GET",
                });
              }}
              value={webApiTemplate.method}
            >
              <Stack direction="row">
                <Radio value="POST">POST</Radio>
                <Radio value="GET">GET</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl display="flex" flexDirection="column" gap={2}>
            <FormLabel htmlFor={`webApiTemplate-${id}-outputJsonPath`}>
              Output JSON Path
            </FormLabel>
            <Input
              id={`webApiTemplate-${id}-outputJsonPath`}
              value={webApiTemplate.outputJsonPath}
              onInput={(e) => {
                setWebApiTemplate({
                  ...webApiTemplate,
                  outputJsonPath: e.currentTarget.value,
                });
              }}
            />
          </FormControl>
        </>
      )}
    </FormControl>
  );
};

export default WebApiTemplateEditor;
