import { FormControl, FormLabel, Spacer, Switch } from "@chakra-ui/react";
import { JsonEditor } from "@incmix/ui";
import { useJsonString } from "@incmix/utils";
import { FunctionComponent } from "react";

import SimpleInput from "./SimpleInput";

const StaticDataSourceNameTypeJsonSchemaEditor: FunctionComponent<{
  type: "scalar" | "collection";
  setType: (newType: "scalar" | "collection") => void;
  name: string;
  setName: (newName: string) => void;
  id: string;
  usedJsonSchemaString: ReturnType<typeof useJsonString>;
}> = ({ type, setType, name, setName, id, usedJsonSchemaString }) => {
  return (
    <>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor={`adse-control-${id}_type`}>Collection</FormLabel>
        <Spacer />
        <Switch
          id={`adse-control-${id}_type`}
          isChecked={type === "collection"}
          onInput={(e) => {
            const newType = type === "scalar" ? "collection" : "scalar";
            setType(newType);
          }}
        />
      </FormControl>

      <SimpleInput value={name} setValue={setName} label="Name" />

      <JsonEditor label="Json Schema" usedJsonString={usedJsonSchemaString} />
    </>
  );
};

export default StaticDataSourceNameTypeJsonSchemaEditor;
