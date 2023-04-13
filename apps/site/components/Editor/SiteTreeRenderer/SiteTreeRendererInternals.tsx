import { chakra } from "@chakra-ui/react";
import {
  combineDndId,
  findNode,
  isDroppableInline,
  mapObject,
  moveItemInArray,
  PageTreeComponentInformation,
  transformLayoutPropsTochakraCSS,
} from "@incmix/utils";
import produce from "immer";
import { FunctionComponent, useContext, useMemo, useState } from "react";

import Draggable from "../Draggable";
import ComponentOutline from "./ComponentOutline";
import { PageNodeInformation } from "./PageNodeInformation";
import SiteTreeRendererChildren from "./SiteTreeRendererChildren";
import SiteTreeRendererContext from "./SiteTreeRendererContext";

const SiteTreeRendererInternals: FunctionComponent<{
  currentPageNodeInformation: PageNodeInformation;
}> = ({ currentPageNodeInformation }) => {
  /**
   * YOU CAN NOT USE THE UI BUILDER CONTEXT IN THIS FILE! THIS IS THE `SiteTreeRendererInternals` COMPONENT
   * THE WHOLE POINT IS TO NOT USE UI BUILDER CONTEXT;
   */

  const { edit, dataSources, languageCode, site, pageNodes } = useContext(
    SiteTreeRendererContext,
  );

  const childrenAreas = useMemo(
    () =>
      mapObject(currentPageNodeInformation.node.childrenIds, (_, _key) => {
        const childKey = `${_key}`;
        return (
          <SiteTreeRendererChildren
            key={combineDndId(currentPageNodeInformation.node.id, childKey)}
            childKey={childKey}
            currentPageNodeInformation={currentPageNodeInformation}
          />
        );
      }),

    [currentPageNodeInformation],
  );

  const parentInfo = currentPageNodeInformation.parent;

  const onDelete = () => {
    if (!parentInfo) return;
    edit?.setPageNodes(
      produce(pageNodes, (prevPageNodes) => {
        const parent = findNode({
          nodeId: currentPageNodeInformation.parent?.parentNode?.id ?? "",
          pageNodes: prevPageNodes,
        });
        if (!parent) return;
        parent.childrenIds[parentInfo.areaName].ids = parent?.childrenIds[
          parentInfo.areaName
        ].ids.filter((id) => id !== currentPageNodeInformation.node.id);
      }),
    );
  };

  // TODO: Add support for user defined components here
  const Component = (
    currentPageNodeInformation.pageTreeComponentInformation as PageTreeComponentInformation
  ).component;

  const moveSelfInContainer = (index: number) => {
    edit?.setPageNodes(
      produce(pageNodes, (prevPageNodes) => {
        if (!parentInfo) return;
        const parent = prevPageNodes.find(
          (n) => n.id === parentInfo.parentNode.id,
        );
        if (!parent) return;
        parent.childrenIds[parentInfo.areaName].ids = moveItemInArray(
          parent.childrenIds[parentInfo.areaName].ids,
          currentPageNodeInformation.node.id,
          index,
        );
      }),
    );
  };

  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const inline = isDroppableInline(
    ref?.parentElement?.parentElement,
    ".editable-component",
  );

  // TODO: How to enable this code ~~~~JASPREET PLEASE TAKE A LOOK HERE~~~~
  // // Forcing the comonent to rerender to update arrow direction when flex-direction is changed.
  // // TODO: find a better way to make it reactive
  // useEffect(() => {
  //   edit?.setHoveredNodeId(cuid());
  // }, [
  //   currentPageNodeInformation.node.id,
  //   currentPageNodeInformation.node.props.styleProps,
  //   edit?.setHoveredNodeId,
  //   edit,
  // ]);

  const placeHolderText = useMemo(() => {
    return (
      currentPageNodeInformation.pageTreeComponentInformation as PageTreeComponentInformation
    ).textualProps.find((p) => p.propName === "text")?.placeholderData;
  }, [currentPageNodeInformation]);

  const isSelectedPageNode =
    currentPageNodeInformation.node.id === edit?.selectedPageNodeId;
  const showHighlight = isSelectedPageNode && edit?.inHighlightMode;

  return (
    <chakra.div
      ref={setRef}
      className="editable-component"
      sx={{
        ...transformLayoutPropsTochakraCSS(
          currentPageNodeInformation.node.props.layoutProps,
        ),
        display: currentPageNodeInformation.node.isInline
          ? "inline-block"
          : "block",
        position: "relative",
        isolation: "isolate",
        outline: showHighlight ? "2px solid red" : "",
      }}
      onMouseEnter={() =>
        edit?.setHoveredNodeId(currentPageNodeInformation.node.id)
      }
      onMouseLeave={() =>
        edit?.setHoveredNodeId(
          currentPageNodeInformation.parent?.parentNode.id ?? null,
        )
      }
    >
      <Draggable
        id={combineDndId("page", currentPageNodeInformation.node.id)}
        data={{
          ...currentPageNodeInformation.node,
          parentId: currentPageNodeInformation.parent?.parentNode?.id,
        }}
        disabled={!currentPageNodeInformation.node.editable}
        useHandle
        isHovered={
          edit
            ? edit.hoveredNodeId === currentPageNodeInformation.node.id &&
              // The Bar shouldn't show for the root node
              !!currentPageNodeInformation.parent
            : false
        }
        onDelete={onDelete}
        onSelect={() =>
          currentPageNodeInformation.parent &&
          edit?.setSelectedPageNodeId(currentPageNodeInformation.node.id)
        }
        inEditMode={!!edit}
      >
        <ComponentOutline
          pageTreeComponentInformation={
            currentPageNodeInformation.pageTreeComponentInformation as PageTreeComponentInformation
          }
          isInline={inline}
          show={!!edit && (edit?.outlineMode ?? false)}
          showLeftArrow={parentInfo?.childIndex !== 0}
          showRightArrow={!parentInfo?.isLastChild}
          onClickLeftArrow={() =>
            moveSelfInContainer((parentInfo?.childIndex ?? 0) - 1)
          }
          onClickRightArrow={() =>
            moveSelfInContainer((parentInfo?.childIndex ?? 0) + 1)
          }
        >
          <Component
            site={site}
            childrenAreas={childrenAreas}
            styleProps={currentPageNodeInformation.node.props.styleProps}
            dataProps={mapObject(
              currentPageNodeInformation.node.props.dataProps,
              (v) => {
                return v.type === "dataSource"
                  ? {
                      type: "dataSource",
                      dataSource: dataSources.find((ds) => ds.id === v.id)!,
                    }
                  : v.type === "static"
                  ? { type: "static", value: v.value }
                  : { type: "placeholder" };
              },
            )}
            textualProps={mapObject(
              currentPageNodeInformation.node.props.textualProps,
              (v) => {
                return v
                  ? site?.textDataBase?.[v]?.[languageCode]
                  : placeHolderText;
              },
            )}
            inEditMode={!!edit}
          />
        </ComponentOutline>
      </Draggable>
    </chakra.div>
  );
};

export default SiteTreeRendererInternals;
