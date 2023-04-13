import { chakra } from "@chakra-ui/system";
import { DerivedDataSourceTransformation } from "@incmix/utils";
import { FunctionComponent } from "react";

interface TransformationEditorProps {
  transformation: DerivedDataSourceTransformation;
  onSubmit: (t: DerivedDataSourceTransformation) => void;
}

const TransformationEditor: FunctionComponent<
  TransformationEditorProps
> = () => {
  return <chakra.form />;
};

export default TransformationEditor;
