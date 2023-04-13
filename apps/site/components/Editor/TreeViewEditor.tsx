import { TreeView } from "@incmix/ui";
import {
  addChildAtIndex,
  findNode,
  findPageNodePageTreeComponentInformation,
  findParentNode,
  movePageNode,
  PageNode,
  removeItemFromArray,
  splitDndId,
} from "@incmix/utils";
import produce from "immer";
import { useContext } from "react";

import UiBuilderContext from "./UiBuilderContext";

type TreeViewEditorNode =
  | { type: "pageNode"; pageNode: PageNode }
  | { type: "childArea"; parentNode: PageNode; childAreaName: string };

type TreeViewEditorIdSplit = [
  type: TreeViewEditorNode["type"],
  childAreaName: string,
  id: string,
];

const SPLITTER = "________";
const CHILD_AREA_NAME_NA = "N_A";

const assert = (
  v: boolean,
  msg = "The `v` provided to `assert` isn't true",
): v is true => {
  if (v === true) return v;
  throw new Error(msg);
};

const idToTreeViewEditorNode = ({
  id,
  pageNodes,
}: {
  id: string;
  pageNodes: PageNode[];
}): TreeViewEditorNode => {
  const throwError = () => {
    throw new Error(`invalid id ${id} given to idToTreeViewEditorNode`);
  };
  const split = id.split(SPLITTER) as TreeViewEditorIdSplit;

  assert(split.length === 3);
  assert(["pageNode", "childArea"].includes(split[0]));
  assert(split[0] === "pageNode" ? split[1] === CHILD_AREA_NAME_NA : true);

  const [splitType, splitChildAreaName, splitId]: TreeViewEditorIdSplit = split;
  const isChild = splitType === "childArea";
  const pageNode = findNode({ pageNodes, nodeId: splitId });

  assert(pageNode !== null);

  if (isChild) {
    return {
      childAreaName: splitChildAreaName,
      parentNode: pageNode!,
      type: "childArea",
    };
  }

  return {
    type: "pageNode",
    pageNode: pageNode!,
  };
};

const treeViewEditorNodeToId = (n: TreeViewEditorNode): string => {
  const splitArr: TreeViewEditorIdSplit = [
    n.type,
    n.type === "childArea" ? n.childAreaName : CHILD_AREA_NAME_NA,
    (n.type === "childArea" ? n.parentNode : n.pageNode).id,
  ];

  return splitArr.join(SPLITTER);
};

const TreeViewEditor = () => {
  const { page, setPage, pageTreeComponentInformations } =
    useContext(UiBuilderContext);
  const { pageNodes } = page.pageTree;

  return (
    <TreeView<TreeViewEditorNode>
      getById={(nodeId) => {
        return idToTreeViewEditorNode({
          id: nodeId,
          pageNodes: page.pageTree.pageNodes,
        });
      }}
      getChildren={(item) => {
        if (item.type === "childArea") {
          return item.parentNode.childrenIds[item.childAreaName].ids.map(
            (childId) => ({
              type: "pageNode",
              pageNode: findNode({ pageNodes, nodeId: childId })!,
            }),
          );
        }
        return Object.keys(item.pageNode.childrenIds).map((key) => ({
          childAreaName: key,
          parentNode: item.pageNode,
          type: "childArea",
        }));
      }}
      getChildrenEditable={(item) => {
        return item.type === "childArea";
      }}
      getDisplayItems={(item) => {
        // TODO: Work on this
        return item.type === "childArea"
          ? [
              { type: "text", text: item.childAreaName },
              { type: "spacer" },
              { type: "collapse" },
            ]
          : [
              { type: "dragger" },
              {
                type: "button",
                colorScheme: "red",
                size: "xs",
                variant: "link",
                description: "Delete",
                icon: "trash",
                onClick() {
                  setPage(
                    produce(page, (draftPage) => {
                      // TODO: Refactor this to use a `removePageNode` helper function
                      // TODO: The current code isn't removing children of the deleted node
                      const { pageNode } = item;

                      const parentPageNode = findParentNode({
                        nodeId: pageNode.id,
                        pageNodes: draftPage.pageTree.pageNodes,
                      });

                      if (!parentPageNode) {
                        throw new Error("Couldn't Find Parent Page Node");
                      }

                      const child =
                        parentPageNode.parentNode.childrenIds[
                          parentPageNode.childName
                        ];

                      child.ids = removeItemFromArray(child.ids, pageNode.id);
                    }),
                  );
                },
              },
              {
                type: "text",
                text:
                  findPageNodePageTreeComponentInformation({
                    pageNode: item.pageNode,
                    pageTreeComponentInformations,
                    userDefinedPageTreeComponentInformations: [],
                  })?.name ?? "Unknown Component",
              },
              { type: "spacer" },
              { type: "collapse" },
            ];
      }}
      getId={(item) => {
        return treeViewEditorNodeToId(item);
      }}
      getParent={(item) => {
        if (item.type === "childArea")
          return { type: "pageNode", pageNode: item.parentNode };

        const foundParentNode = findParentNode({
          nodeId: item.pageNode.id,
          pageNodes,
        })!;

        if (foundParentNode === null) {
          return null;
        }

        return {
          type: "childArea",
          childAreaName: foundParentNode.childName,
          parentNode: foundParentNode.parentNode,
        };
      }}
      getSupportsChildren={() => {
        return true;
      }}
      rootNode={{
        type: "childArea",
        parentNode: findNode({ nodeId: page.pageTree.rootId, pageNodes })!,
        childAreaName: "children",
      }}
      showRootNode={false}
      moveItem={({ destination, index, item }) => {
        if (destination.type !== "childArea") return;
        if (item.type !== "pageNode") return;

        const destinationChildArea = destination as typeof destination & {
          type: "childArea";
        };

        const itemPageNode = item as typeof item & { type: "pageNode" };
        const nodeId = itemPageNode.pageNode.id;
        const newParent = {
          childName: destinationChildArea.childAreaName,
          parentNode: destinationChildArea.parentNode,
        };

        setPage(
          produce(page, (p) => {
            p.pageTree.pageNodes = movePageNode({
              pageNodes,
              index,
              newParent,
              nodeId,
            });
          }),
        );
      }}
    />
  );
};

export default TreeViewEditor;
