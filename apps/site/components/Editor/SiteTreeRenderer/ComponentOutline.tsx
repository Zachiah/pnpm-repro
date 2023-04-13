import { chakra } from "@chakra-ui/system";
import { PageTreeComponentInformation } from "@incmix/utils";
import React, { ReactNode } from "react";

import ArrowButton from "./ArrowButton";

const ComponentOutline: React.FC<{
  show: boolean;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  isInline?: boolean;
  children: ReactNode;
  pageTreeComponentInformation: PageTreeComponentInformation;
  onClickLeftArrow?: () => void;
  onClickRightArrow?: () => void;
}> = ({
  show = false,
  showLeftArrow,
  showRightArrow,
  onClickLeftArrow,
  onClickRightArrow,
  children,
  isInline,
  pageTreeComponentInformation,
}) => {
  return show ? (
    <chakra.div
      sx={{ display: "inherit" }}
      className="component-outline"
      padding="5"
      borderColor="blue.400"
      borderStyle="dashed"
      borderWidth="2px"
      position="relative"
    >
      <chakra.div
        fontSize="sm"
        display="flex"
        gap="1"
        position="absolute"
        top="0"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={10}
        background="Background"
      >
        {showLeftArrow && (
          <ArrowButton
            onClick={() => onClickLeftArrow && onClickLeftArrow()}
            direction={isInline ? "left" : "up"}
          />
        )}
        {pageTreeComponentInformation.name}
        {showRightArrow && (
          <ArrowButton
            onClick={() => onClickRightArrow && onClickRightArrow()}
            direction={isInline ? "right" : "down"}
          />
        )}
      </chakra.div>
      {children}
    </chakra.div>
  ) : (
    <>{children}</>
  );
};

export default ComponentOutline;
