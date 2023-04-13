import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import React from "react";

const ComponentToolbar: React.FC<
  {
    listeners?: DraggableSyntheticListeners;
    id?: string;
    onDelete?: (id?: string) => void;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">
> = ({ id, listeners, onDelete, ...props }) => {
  return (
    <Flex
      borderRadius="md"
      gap="16px"
      alignItems="center"
      bgColor="gray.100"
      width="max-content"
      py="1"
      px="2"
      position="absolute"
      zIndex="100"
      bottom="100%"
      {...props}
    >
      <chakra.div {...listeners} cursor="grab" height="auto" minW="max-content">
        <Icon as={DragHandleIcon} />
      </chakra.div>
      <Button
        variant="unstyled"
        color="red.500"
        size="md"
        height="auto"
        minW="max-content"
        onClick={() => {
          console.log("onDelete");
          if (onDelete) onDelete(id);
        }}
      >
        <Icon as={DeleteIcon} />
      </Button>
    </Flex>
  );
};

export default ComponentToolbar;
