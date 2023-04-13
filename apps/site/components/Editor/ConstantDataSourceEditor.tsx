import { chakra } from "@chakra-ui/system";
import { JsonEditor } from "@incmix/ui";
import {
  ConstantDataSource,
  useJsonString,
  useModifiedUseState,
} from "@incmix/utils";

import ApiPanelBottomSubmitButton from "./ApiPanelBottomSubmitButton";
import SimpleInput from "./SimpleInput";

const ConstantDataSourceEditor = ({
  constantDataSource,
  setConstantDataSource,
}: {
  constantDataSource: ConstantDataSource;
  setConstantDataSource: (v: ConstantDataSource) => void;
}) => {
  const { useModifiedState, modified } = useModifiedUseState();
  const [name, setName] = useModifiedState(constantDataSource.name);
  const jsonSchemaString = useJsonString(constantDataSource.jsonSchema, {
    useState: useModifiedState,
  });
  const valueJsonString = useJsonString(constantDataSource.value, {
    useState: useModifiedState,
  });

  return (
    <chakra.form
      p={4}
      pb={20}
      display="flex"
      flexDirection="column"
      gap={4}
      onSubmit={(e) => {
        e.preventDefault();

        // TODO: Tell the user why it ain't working
        if (!jsonSchemaString.valid) return;

        setConstantDataSource({
          id: constantDataSource.id,
          value: valueJsonString.value,
          jsonSchema: jsonSchemaString.value,
          name,
          dsType: "constant",
        });
      }}
    >
      <SimpleInput value={name} setValue={setName} label="Name" />
      <JsonEditor usedJsonString={jsonSchemaString} label="JSON Schema" />
      <JsonEditor usedJsonString={valueJsonString} label="Value (JSON)" />

      <ApiPanelBottomSubmitButton hasChanges={modified} />
    </chakra.form>
  );
};

export default ConstantDataSourceEditor;
