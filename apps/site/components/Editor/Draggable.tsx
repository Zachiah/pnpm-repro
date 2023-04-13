import { chakra } from "@chakra-ui/system";
import { useDraggable } from "@dnd-kit/core";
import { PageNode } from "@incmix/utils";
import React, { useEffect, useMemo } from "react";

import ComponentToolbar from "./SiteTreeRenderer/ComponentToolbar";

const Draggable: React.FunctionComponent<{
  id: string | number;
  disabled?: boolean;
  data?: PageNode & { parentId?: string };
  children: React.ReactNode;
  useHandle?: boolean;
  isHovered?: boolean;
  onDelete?: (id?: string) => void;
  onSelect?: (id?: string) => void;
  setIsDragging?: (flag: boolean) => void;
  hideOnDrag?: boolean;
  inEditMode?: boolean;
}> = ({
  id,
  data,
  children,
  setIsDragging,
  disabled = false,
  useHandle = false,
  isHovered = false,
  onDelete,
  onSelect,
  inEditMode = true,
  hideOnDrag = true,
}) => {
  const { listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const display = useMemo(() => {
    if (isDragging && hideOnDrag) return "none";
    return "inherit";
  }, [isDragging, hideOnDrag]);

  useEffect(() => {
    if (setIsDragging) setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);
  return inEditMode ? (
    <chakra.div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(data?.id);
      }}
      sx={{ display, width: "100%" }}
      {...(!useHandle ? listeners : {})}
    >
      {useHandle && isHovered ? (
        <ComponentToolbar
          onDelete={onDelete}
          id={data?.id}
          listeners={listeners}
        />
      ) : (
        <></>
      )}
      {children}
    </chakra.div>
  ) : (
    <>{children}</>
  );
};

export default Draggable;
