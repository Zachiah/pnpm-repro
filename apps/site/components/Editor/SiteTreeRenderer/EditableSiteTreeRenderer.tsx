import {
  findNode,
  findPageNodePageTreeComponentInformation,
  PageTreeComponentInformation,
} from "@incmix/utils";
import { FunctionComponent, useContext, useState } from "react";

import UiBuilderContext from "../UiBuilderContext";
import SiteTreeRendererContext from "./SiteTreeRendererContext";
import SiteTreeRendererInternals from "./SiteTreeRendererInternals";

const EditableSiteTreeRenderer: FunctionComponent = () => {
  const {
    page,
    setPage,
    site,
    pageTreeComponentInformations,
    dataSources,
    editMode,
    languageCode,
    outlineMode,
    selectedPageNodeId,
    setSelectedPageNodeId,
    rightSidebarTabIndex,
    currentDraggingId,
    setCurrentDraggingId,
  } = useContext(UiBuilderContext);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const rootNode = findNode({
    nodeId: page.pageTree.rootId,
    pageNodes: page.pageTree.pageNodes,
  });

  if (!rootNode) throw new Error("No root Node");

  const rootInformation = findPageNodePageTreeComponentInformation({
    pageNode: rootNode,
    pageTreeComponentInformations,
    userDefinedPageTreeComponentInformations: [],
  });

  if (!rootInformation) throw new Error("No root information");

  return (
    <SiteTreeRendererContext.Provider
      value={{
        dataSources,
        languageCode,
        site,
        pageNodes: page.pageTree.pageNodes,
        pageTreeComponentInformations,
        edit: editMode
          ? {
              inHighlightMode: rightSidebarTabIndex === 0,
              outlineMode,
              selectedPageNodeId,
              setPageNodes: (pns) =>
                setPage({
                  ...page,
                  pageTree: {
                    ...page.pageTree,
                    pageNodes: pns,
                  },
                }),
              setSelectedPageNodeId,
              currentDraggingId,
              setCurrentDraggingId,
              hoveredNodeId,
              setHoveredNodeId,
            }
          : null,
      }}
    >
      <SiteTreeRendererInternals
        currentPageNodeInformation={{
          node: rootNode,
          pageTreeComponentInformation:
            rootInformation as PageTreeComponentInformation,
          parent: null,
        }}
      />
    </SiteTreeRendererContext.Provider>
  );
};

export default EditableSiteTreeRenderer;
