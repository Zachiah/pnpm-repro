import { chakra } from "@chakra-ui/system";
import { useDroppable } from "@dnd-kit/core";
import { Icon } from "@incmix/ui";
import { isDroppableInline, isDroppableInValid, PageNode } from "@incmix/utils";
import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import UiBuilderContext from "./UiBuilderContext";

const Droppable: React.FunctionComponent<{
  id: string;
  areaName: string;
  data?: PageNode;
  disabled?: boolean;
  alwaysShow?: boolean;
  showLine?: boolean;
  inline?: boolean;
  children?: ReactNode;
}> = ({
  id,
  areaName,
  data,
  disabled,
  showLine = false,
  alwaysShow = false,
  inline = false,
  children,
}) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data,
    disabled: isInvalid || disabled,
  });
  const { editMode } = useContext(UiBuilderContext);

  useEffect(() => {
    if (active)
      setIsInvalid(
        isDroppableInValid(areaName, active.data.current as PageNode, data),
      );
  }, [active, active?.data, areaName, data]);

  const bgColor = useMemo(() => {
    if (active && (isInvalid || disabled)) return "red.400";
    if (!isOver && !isInvalid) return "gray.300";
    if (!isInvalid && isOver) return "blue.400";

    return "gray.300";
  }, [active, disabled, isInvalid, isOver]);

  const droppableRef = useRef<HTMLDivElement | null>(null);

  const [isInline, setIsInline] = useState(false);

  const assignRef = (element: HTMLDivElement | null) => {
    droppableRef.current = element;
    setNodeRef(element);

    setIsInline(isDroppableInline(droppableRef.current, ".editable-component"));
  };

  return editMode ? (
    <chakra.div
      sx={{ display: isInline ? "inline-block" : "block" }}
      ref={assignRef}
    >
      {showLine ? (
        <DroppableLine show={isOver} inline={isInline}>
          {children}
        </DroppableLine>
      ) : active || alwaysShow ? (
        <chakra.div
          sx={{
            padding: "1",
            fontWeight: "normal",
            opacity: ".7",
            textAlign: "center",
            border: "1px solid",
            borderColor: "gray.400",
            margin: "1",
            backgroundColor: bgColor,
          }}
        >
          {data?.dropIcon ? (
            typeof data?.dropIcon === "string" ? (
              <Icon icon={data?.dropIcon} />
            ) : (
              data?.dropIcon
            )
          ) : (
            "Drop Component Here"
          )}
        </chakra.div>
      ) : (
        <></>
      )}
    </chakra.div>
  ) : (
    <>{children}</>
  );
};

const DroppableLine: React.FC<{
  inline?: boolean;
  children?: ReactNode;
  show?: boolean;
}> = ({ inline = false, show = false, children }) => {
  const styles: CSSProperties = {
    display: inline ? "inline-block" : "block",
    borderLeft: inline ? "2px solid" : "none",
    borderTop: !inline ? "2px solid" : "none",
    padding: "1",
    borderColor: "blue.400",
  };
  return show ? (
    <chakra.div sx={styles}>{children}</chakra.div>
  ) : (
    <chakra.div
      sx={{ display: inline ? "inline-block" : "block", padding: "1" }}
    >
      {children}
    </chakra.div>
  );
};

export default Droppable;
