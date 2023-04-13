import { chakra } from "@chakra-ui/react";
import { JsonEditor } from "@incmix/ui";
import {
  StateDataSource,
  useJsonString,
  useModifiedUseState,
} from "@incmix/utils";
import { FunctionComponent } from "react";

import ApiPanelBottomSubmitButton from "./ApiPanelBottomSubmitButton";
import StaticDataSourceNameTypeJsonSchemaEditor from "./StaticDataSourceNameTypeJsonSchemaEditor";

const StateDataSourceEditor: FunctionComponent<{
  stateDataSource: StateDataSource;
  setStateDataSource: (newStateDataSource: StateDataSource) => void;
}> = ({ stateDataSource, setStateDataSource }) => {
  const { useModifiedState, modified } = useModifiedUseState();

  const [name, setName] = useModifiedState(stateDataSource.name);
  const [type, setType] = useModifiedState(stateDataSource.type);
  const jsonSchema = useJsonString(stateDataSource.jsonSchema, {
    useState: useModifiedState,
  });

  const initialValueJsonString = useJsonString(
    (stateDataSource as typeof stateDataSource & { type: "scalar" })
      .initialValue,
    { useState: useModifiedState },
  );
  const initialItemsJsonString = useJsonString(
    (stateDataSource as typeof stateDataSource & { type: "collection" })
      .initialItems,
    {
      useState: useModifiedState,
    },
  );
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
        if (!jsonSchema.valid) return;
        if (!initialValueJsonString.valid) return;

        setStateDataSource({
          id: stateDataSource.id,
          initialValue: initialValueJsonString.value,
          initialItems: initialValueJsonString.value,
          jsonSchema: jsonSchema.value,
          name,
          type,
          dsType: "state",
        });
      }}
    >
      <StaticDataSourceNameTypeJsonSchemaEditor
        id={stateDataSource.id}
        usedJsonSchemaString={jsonSchema}
        name={name}
        setName={setName}
        setType={(newType) => {
          setType(newType);

          if (newType === "scalar") {
            initialItemsJsonString.setValue([]);
          } else {
            initialValueJsonString.setValue({});
          }
        }}
        type={type}
      />

      {type === "scalar" ? (
        <JsonEditor
          label="Initial Value (JSON)"
          usedJsonString={initialValueJsonString}
        />
      ) : (
        <JsonEditor
          label="Initial Items (JSON)"
          usedJsonString={initialItemsJsonString}
        />
      )}

      <ApiPanelBottomSubmitButton hasChanges={modified} />
    </chakra.form>
  );
};

export default StateDataSourceEditor;
