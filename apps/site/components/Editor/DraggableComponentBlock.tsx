import { chakra } from "@chakra-ui/react";
import { combineDndId, PageTreeComponentBlock } from "@incmix/utils";
import { FunctionComponent } from "react";

import Draggable from "./Draggable";

const DraggableComponentBlock: FunctionComponent<{
  editMode: boolean;
  compBlock: PageTreeComponentBlock;
}> = ({ editMode, compBlock }) => {
  return (
    <Draggable
      inEditMode={editMode}
      hideOnDrag={false}
      key={combineDndId("sidebar", compBlock.id)}
      id={combineDndId("sidebar", compBlock.id)}
      data={{ ...compBlock.pageTree.pageNodes[0], isInline: true }}
    >
      <chakra.div
        h="150px"
        position="relative"
        textAlign="center"
        padding="2"
        sx={{
          marginBottom: "4",
        }}
      >
        <chakra.div
          zIndex={10}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          cursor="move"
        />
        <compBlock.sidebarRenderer />
      </chakra.div>
    </Draggable>
  );
};

export default DraggableComponentBlock;
