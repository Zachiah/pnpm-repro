import { chakra } from "@chakra-ui/react";
import {
  findNode,
  findPageNodePageTreeComponentInformation,
  PageTreeComponentInformation,
  splitDndId,
} from "@incmix/utils";
import { FunctionComponent, useContext } from "react";

import UiBuilderContext from "./UiBuilderContext";

const Dragger: FunctionComponent = () => {
  const {
    currentDraggingId,
    page,
    pageTreeComponentInformations,
    pageTreeComponentBlocks,
  } = useContext(UiBuilderContext);

  if (!currentDraggingId) return null;

  const [type, id] = splitDndId(currentDraggingId);

  const pageNode =
    type === "sidebar"
      ? (() => {
          const block = pageTreeComponentBlocks.find((item) => item.id === id);

          if (!block) {
            throw new Error("Couldn't find block!");
          }

          return findNode({
            pageNodes: block.pageTree.pageNodes,
            nodeId: block.pageTree.rootId,
          });
        })()
      : (() => {
          const foundNode = findNode({
            pageNodes: page.pageTree.pageNodes,
            nodeId: id,
          });

          return foundNode;
        })();

  if (!pageNode) {
    throw new Error(
      `Couldn't find node for id ${currentDraggingId}\n this should never happen!\n Please contact the developers`,
    );
  }

  const information = findPageNodePageTreeComponentInformation({
    pageNode,
    pageTreeComponentInformations,
    userDefinedPageTreeComponentInformations: [],
  }) as PageTreeComponentInformation;

  if (!information) {
    throw new Error(
      `Couldn't find information for node with ${currentDraggingId}\n this should never happen!\n Please contact the developers`,
    );
  }

  return (
    <chakra.div opacity=".5" width="max-content">
      <information.dragSilhouette width="300px" />
    </chakra.div>
  );
};

export default Dragger;
