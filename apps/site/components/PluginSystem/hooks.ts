import { Bounds, isMac, Vec2 } from "@incmix/utils";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export const EDGE_SCROLL_FACTOR = 0.000001;

export const useElSize = (
  elRef: MutableRefObject<HTMLElement | null>,
): Vec2 | null => {
  const [elSize, setElSize] = useState<Vec2 | null>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setElSize({
        x: entries[0].contentRect.width,
        y: entries[0].contentRect.height,
      });
    });

    console.assert(
      elRef.current,
      "wrapperDivRef.current should be truthy in useEffect",
    );
    resizeObserver.observe(elRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elRef]);

  return elSize;
};

export const useShortcuts = (events: {
  handleGrow?: (e: KeyboardEvent) => void;
  handleShrink?: (e: KeyboardEvent) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const condKey = isMac ? e.metaKey : e.ctrlKey;

      if (condKey && e.key === "=") {
        if (events.handleGrow) {
          e.preventDefault();
          events.handleGrow(e);
        }
      }

      if (condKey && e.key === "-") {
        if (events.handleShrink) {
          e.preventDefault();
          events.handleShrink(e);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [events]);
};

export const usePointerLock = (
  ref: MutableRefObject<HTMLElement | null>,
  params: {
    handlePointerMove?: (e: PointerEvent) => void;
    handleExitPointerLock?: (e: PointerEvent | null) => void;
    handlePointerDown?: (e: PointerEvent) => void;
    shouldMatch?: (e: PointerEvent) => boolean;
  },
) => {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerDown = (e: PointerEvent) => {
      const shouldMatch =
        params.shouldMatch ?? ((e) => e.target === e.currentTarget);

      if (!shouldMatch(e)) return;

      console.log("Pointer Down");
      // e.stopPropagation();
      params.handlePointerDown?.(e);

      (e.currentTarget as HTMLElement).requestPointerLock();

      setLocked(true);
    };
    el.addEventListener("pointerdown", handlePointerDown);

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [params, ref]);

  useEffect(() => {
    if (locked) {
      const handlePointerMove = (e: PointerEvent) => {
        params.handlePointerMove?.(e);
      };
      const handlePointerUp = (e: PointerEvent) => {
        params.handleExitPointerLock?.(e);

        document.exitPointerLock();

        setLocked(false);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [locked, params]);

  useEffect(() => {
    if (locked) {
      const interval = setInterval(() => {
        if (!document.pointerLockElement) {
          console.log(
            "Exiting lock because there is no pointer lock on the document",
          );

          params.handleExitPointerLock?.(null);

          setLocked(false);
        }
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [locked, params]);

  return locked;
};
