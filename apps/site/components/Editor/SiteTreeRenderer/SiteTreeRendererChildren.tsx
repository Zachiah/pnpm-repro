import { FunctionComponent, useMemo } from "react";

import { PageNodeInformation } from "./PageNodeInformation";
import {
  SiteTreeRendererChildOrDropzone,
  SiteTreeRendererChildOrDropzoneRenderer,
} from "./SiteTreeRendererChildOrDropzone";

const SiteTreeRendererChildren: FunctionComponent<{
  childKey: string;
  currentPageNodeInformation: PageNodeInformation;
}> = ({ childKey, currentPageNodeInformation }) => {
  const childIds = currentPageNodeInformation.node.childrenIds[childKey];

  const childrenIdsWithDropZones: SiteTreeRendererChildOrDropzone[] = useMemo(
    () => [
      ...childIds.ids.map(
        (childIdString, index, array) =>
          ({
            type: "childId",
            childId: childIdString,
            index,
            isLastChild: index === array.length - 1,
          } as const),
      ),
      {
        type: "dropzone",
        index: childIds.ids.length,
        alwaysShow: currentPageNodeInformation.node.alwaysShowDroppable,
      },
    ],
    [childIds.ids, currentPageNodeInformation.node.alwaysShowDroppable],
  );

  return (
    <>
      {childrenIdsWithDropZones.map((childOrDropzone, index) => (
        <SiteTreeRendererChildOrDropzoneRenderer
          childKey={childKey}
          childOrDropzone={childOrDropzone}
          key={`${childOrDropzone.type}-${
            childOrDropzone.type === "childId"
              ? childOrDropzone.childId
              : childOrDropzone.index
          }`}
          currentPageNodeInformation={currentPageNodeInformation}
        />
      ))}
    </>
  );
};

export default SiteTreeRendererChildren;
