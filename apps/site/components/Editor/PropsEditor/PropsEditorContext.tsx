import { PageTreeComponentInformation } from "@incmix/utils";
import { createContext } from "react";

const PropsEditorContext = createContext<{
  pageNodeIndex: number;
  componentInformation: PageTreeComponentInformation;
}>(null!);

export default PropsEditorContext;
