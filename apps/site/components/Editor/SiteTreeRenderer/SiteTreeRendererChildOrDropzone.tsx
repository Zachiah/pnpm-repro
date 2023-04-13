import {
  combineDndId,
  findNode,
  findPageNodePageTreeComponentInformation,
  PageTreeComponentInformation,
} from "@incmix/utils";
import { FunctionComponent, useContext } from "react";

import Droppable from "../Droppable";
import { PageNodeInformation } from "./PageNodeInformation";
import SiteTreeRendererContext from "./SiteTreeRendererContext";
import SiteTreeRendererInternals from "./SiteTreeRendererInternals";

export type SiteTreeRendererChildOrDropzone =
  | {
      type: "childId";
      childId: string;
      index: number;
      isLastChild?: boolean;
    }
  | {
      type: "dropzone";
      index: number;
      alwaysShow?: boolean;
      showLine?: boolean;
    };

export type SiteTreeRendererChildOrDropzoneList =
  SiteTreeRendererChildOrDropzone[];

export const SiteTreeRendererChildOrDropzoneRenderer: FunctionComponent<{
  childOrDropzone: SiteTreeRendererChildOrDropzone;
  childKey: string;
  currentPageNodeInformation: PageNodeInformation;
}> = ({ childOrDropzone, childKey, currentPageNodeInformation }) => {
  const { pageNodes, pageTreeComponentInformations, edit } = useContext(
    SiteTreeRendererContext,
  );

  if (childOrDropzone.type === "childId") {
    const childNode = findNode({ nodeId: childOrDropzone.childId, pageNodes });

    if (!childNode)
      throw new Error("Wasn't able to find childNode this should never happen");

    const childPageTreeComponentInformation =
      findPageNodePageTreeComponentInformation({
        pageNode: childNode,
        pageTreeComponentInformations,
        userDefinedPageTreeComponentInformations: [],
      });

    if (!childPageTreeComponentInformation)
      throw new Error(
        "Wasn't able to find childPageTreeComponentInformation this should never happen",
      );

    return (
      <Droppable
        id={combineDndId(
          currentPageNodeInformation.node.id,
          childKey,
          childOrDropzone.index,
        )}
        areaName={childKey}
        data={{ ...currentPageNodeInformation.node }}
        inline={currentPageNodeInformation.node.isInline}
        showLine
      >
        <SiteTreeRendererInternals
          currentPageNodeInformation={{
            node: childNode,
            pageTreeComponentInformation:
              childPageTreeComponentInformation as PageTreeComponentInformation,
            parent: {
              areaName: childKey,
              childIndex: childOrDropzone.index,
              isLastChild: childOrDropzone.isLastChild ?? false,
              parentNode: currentPageNodeInformation.node,
            },
          }}
        />
      </Droppable>
    );
  }

  const childrenProp =
    currentPageNodeInformation.pageTreeComponentInformation.children.find(
      (c) => c.childName === childKey,
    );

  return (
    <Droppable
      id={combineDndId(
        currentPageNodeInformation.node.id,
        childKey,
        childOrDropzone.index,
      )}
      areaName={childKey}
      data={{
        ...currentPageNodeInformation.node,
        dropIcon: childrenProp?.dropArea,
      }}
      alwaysShow={childOrDropzone.alwaysShow}
      showLine={childOrDropzone.showLine}
    />
  );
};
