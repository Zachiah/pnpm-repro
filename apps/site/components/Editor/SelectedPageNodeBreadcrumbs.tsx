import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from "@chakra-ui/react";
import { findNode, getPageNodePath } from "@incmix/utils";
import { useContext } from "react";

import UiBuilderContext from "./UiBuilderContext";

const SelectedPageNodeBreadcrumbs = () => {
  const { selectedPageNodeId, page, setSelectedPageNodeId } =
    useContext(UiBuilderContext);

  const path = getPageNodePath({
    nodeId: selectedPageNodeId ?? page.pageTree.rootId,
    pageNodes: page.pageTree.pageNodes,
  });
  return (
    <Breadcrumb>
      {path.map((pathItem) => (
        <BreadcrumbItem key={pathItem}>
          <BreadcrumbLink
            as="button"
            onClick={() => {
              setSelectedPageNodeId(pathItem);
            }}
          >
            {
              findNode({
                nodeId: pathItem,
                pageNodes: page.pageTree.pageNodes,
              })!.componentId
            }
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default SelectedPageNodeBreadcrumbs;
