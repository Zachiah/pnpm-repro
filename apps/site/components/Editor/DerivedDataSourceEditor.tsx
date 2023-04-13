import { chakra, Select } from "@chakra-ui/react";
import { JsonEditor } from "@incmix/ui";
import {
  DerivedDataSource,
  useJsonString,
  useModifiedUseState,
} from "@incmix/utils";
import produce from "immer";
import { FunctionComponent, useContext, useMemo } from "react";

import ApiPanelBottomSubmitButton from "./ApiPanelBottomSubmitButton";
import SimpleInput from "./SimpleInput";
import TransformationEditor from "./TransformationEditor";
import UiBuilderContext from "./UiBuilderContext";

const DerivedDataSourceEditor: FunctionComponent<{
  derivedDataSource: DerivedDataSource;
  setDerivedDataSource: (newDerivedDataSource: DerivedDataSource) => void;
}> = ({ derivedDataSource, setDerivedDataSource }) => {
  const { useModifiedState, modified } = useModifiedUseState();
  const { dataSources } = useContext(UiBuilderContext);
  const [name, setName] = useModifiedState(derivedDataSource.name);
  const jsonSchema = useJsonString(derivedDataSource.jsonSchema, {
    useState: useModifiedState,
  });
  const [srcId, setSrcId] = useModifiedState(derivedDataSource.srcId);

  const [activeTransformationId, setActiveTransformationId] = useModifiedState<
    string | null
  >(null);

  const [transformations, setTransformations] = useModifiedState(
    derivedDataSource.transformations,
  );

  const activeTransformation = useMemo(
    () => transformations.find((tr) => tr),
    [transformations],
  );

  return activeTransformationId === null ? (
    <>
      <chakra.form
        p={4}
        display="flex"
        flexDirection="column"
        gap={4}
        pb={20}
        onSubmit={(e) => {
          e.preventDefault();

          // TODO: Tell the user why it ain't working
          if (!jsonSchema.valid) return;

          setDerivedDataSource({
            id: derivedDataSource.id,
            jsonSchema: jsonSchema.value,
            name,
            srcId: null,
            transformations: [],
            dsType: "derived",
          });
        }}
      >
        <Select
          onChange={(e) => {
            setSrcId(
              e.currentTarget.value === "null" ? null : e.currentTarget.value,
            );
          }}
          value={srcId ?? "null"}
        >
          <option key="null" value="null">
            (None)
          </option>
          {dataSources
            .filter((ds) => ds.id !== derivedDataSource.id)
            .map((dataSource) => (
              <option key={dataSource.id} value={dataSource.id}>
                {dataSource.valid
                  ? dataSource.name
                  : `${dataSource.id} is invalid`}
              </option>
            ))}
        </Select>

        {/* TODO: Use Treeview here to make derived data list */}

        <SimpleInput label="Name" setValue={setName} value={name} />

        <JsonEditor label="JSON Schema" usedJsonString={jsonSchema} />

        <ApiPanelBottomSubmitButton hasChanges={modified} />
      </chakra.form>
    </>
  ) : (
    <>


      {activeTransformation && (
        <TransformationEditor
          transformation={activeTransformation}
          onSubmit={(newTransformation) => {
            const trIndex = transformations.findIndex(
              (tr) => tr.id === newTransformation.id,
            );

            setTransformations(
              produce(transformations, (draftTransformations) => {
                draftTransformations[trIndex] = newTransformation as any;
              }),
            );
          }}
        />
      )}
    </>
  );
};

export default DerivedDataSourceEditor;
