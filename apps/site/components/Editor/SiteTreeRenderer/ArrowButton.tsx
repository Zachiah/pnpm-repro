import { ArrowDownIcon } from "@chakra-ui/icons";
import { Button, Icon } from "@chakra-ui/react";
import React, { MouseEventHandler, useMemo } from "react";

const ArrowButton: React.FC<{
  direction: "up" | "down" | "left" | "right";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ direction, onClick }) => {
  const rotation = useMemo(() => {
    switch (direction) {
      case "up": {
        return "180deg";
      }
      case "left": {
        return "90deg";
      }
      case "right": {
        return "-90deg";
      }
      default: {
        return "0deg";
      }
    }
  }, [direction]);
  return (
    <Button size="xs" onClick={onClick}>
      <Icon transform={`rotate(${rotation})`} as={ArrowDownIcon} />
    </Button>
  );
};

export default ArrowButton;
