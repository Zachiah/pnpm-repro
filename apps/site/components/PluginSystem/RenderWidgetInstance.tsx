import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Bounds, Incmix, Vec2 } from "@incmix/utils";
import {
  Widget,
  WidgetInstance,
  WidgetProps,
  Workspace,
} from "@incmix/utils/src/plugin-system/Incmix";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSnapshot } from "valtio";

import { usePointerLock } from "./hooks";

const RenderWidgetInstance = ({
  widgetInstance,
  widgets,
  onMoveToTop,
  onClose,
  onMove,
  workspace,
  setWorkspace,
  onResize,
  incmixApi,
  dataSnapshot,
}: {
  widgetInstance: Incmix.WidgetInstance;
  widgets: Incmix.Widget[];
  onMoveToTop: () => void;
  onClose: () => void;
  onMove: (delta: Vec2) => void;
  onResize: (growth: Bounds) => void;
  workspace: Workspace;
  setWorkspace: Dispatch<SetStateAction<Workspace>>;
  incmixApi: Incmix.Api;
  dataSnapshot: Incmix.Api["staticData"];
}) => {
  const widget = useMemo(() => {
    const widget = widgets.find((w) => w.id === widgetInstance.widgetId);

    if (widget === undefined || widget === null) {
      throw new Error(
        `Couldn't render widgetInstance couldn't find widget with id ${widgetInstance.widgetId}`,
      );
    }

    return widget;
  }, [widgets, widgetInstance.widgetId]);

  const size = useMemo(
    () => Bounds.size(widgetInstance.pos),
    [widgetInstance.pos],
  );

  const draggerRef = useRef<HTMLDivElement | null>(null);

  // const [locked, setLocked] = useState(false);

  const locked = usePointerLock(
    draggerRef,
    useMemo(
      () => ({
        handlePointerMove(e) {
          onMove({ x: e.movementX, y: e.movementY });
        },
      }),
      [onMove],
    ),
  );

  return (
    <chakra.div
      position="absolute"
      style={{
        left: widgetInstance.pos.min.x,
        top: widgetInstance.pos.min.y,
      }}
      width={size.x}
      height={size.y}
      border="1px solid black"
      outline="1px solid white"
      display="flex"
      flexDir="column"
      borderRadius="md"
      shadow="2xl"
      onPointerDown={(e) => {
        e.stopPropagation();
        console.log("Stopped the propagation");
        onMoveToTop();
      }}
    >
      <DragSideHandle min x onResize={onResize} />
      <DragSideHandle min onResize={onResize} />
      <DragSideHandle x onResize={onResize} />
      <DragSideHandle onResize={onResize} />

      <DragCornerHandle top left onResize={onResize} />
      <DragCornerHandle top onResize={onResize} />
      <DragCornerHandle left onResize={onResize} />
      <DragCornerHandle onResize={onResize} />

      <chakra.div
        background="white"
        color="black"
        borderBottom="1px solid black"
        borderTopRadius="md"
        height="8"
        display="flex"
        paddingX="1"
        gap="1"
        alignItems="center"
      >
        <IconButton size="sm" aria-label="Close" onClick={onClose}>
          <CloseIcon width="2" />
        </IconButton>
        <chakra.h2 fontSize="xs">{widgetInstance.data?.title ?? ""}</chakra.h2>
        <chakra.div flexGrow={1} height="100%" display="flex" ref={draggerRef}>
          <IconButton marginLeft="auto" size="sm" aria-label="Drag">
            <DragHandleIcon width="2" />
          </IconButton>
        </chakra.div>
      </chakra.div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WidgetInstanceComponentRenderer
          widget={widget}
          widgetInstance={widgetInstance}
          workspace={workspace}
          setWorkspace={setWorkspace}
          incmixApi={incmixApi}
          dataSnapshot={dataSnapshot}
          onMoveToTop={onMoveToTop}
        />
      </ErrorBoundary>
    </chakra.div>
  );
};

const WidgetInstanceComponentRenderer = ({
  widget,
  widgetInstance,
  workspace,
  setWorkspace,
  incmixApi,
  dataSnapshot,
  onMoveToTop,
}: {
  widget: Widget;
  widgetInstance: WidgetInstance;
  workspace: Workspace;
  setWorkspace: Dispatch<SetStateAction<Workspace>>;
  incmixApi: Incmix.Api;
  dataSnapshot: Incmix.Api["staticData"];
  onMoveToTop: () => void;
}) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const [widgetRenderer, setWidgetRenderer] =
    useState<Incmix.WidgetRenderer | null>(null);

  useEffect(() => {
    if (!widgetRenderer) return;
    const contentDocument = iframe.current?.contentDocument;

    if (!contentDocument) return;

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).localName !== "button") {
        onMoveToTop();
      }
    };
    contentDocument.addEventListener("pointerdown", handlePointerDown);

    return () => {
      contentDocument.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onMoveToTop, widgetRenderer, workspace]);

  const [updater, setUpdater] = useState<{
    fn: (params: WidgetProps) => void;
  } | null>(null);

  useEffect(() => {
    const iframeEl = iframe.current!;

    console.log("Checking");
    if (!widgetRenderer) return;

    console.log("Creating the root");

    const root = widgetRenderer.createRoot(
      iframeEl.contentDocument!.body.querySelector("#app")!,
    );

    setUpdater({ fn: (v: WidgetProps) => root.update(v) });

    return () => {
      root.cleanup();
    };
  }, [widget, widgetRenderer]);

  useEffect(() => {
    if (!updater) return;

    updater.fn({
      widgetInstanceId: widgetInstance.id,
      workspace: workspace,
      setWorkspace: setWorkspace,
      widgetInstanceData: widgetInstance.data,
      setWidgetInstanceData: (newData) =>
        setWorkspace({
          ...workspace,
          widgetInstances: workspace.widgetInstances.map((wi) =>
            wi.id === widgetInstance.id
              ? { ...widgetInstance, data: newData }
              : wi,
          ),
        }),
      api: incmixApi,
      data: dataSnapshot,
    });
  }, [
    setWorkspace,
    widgetInstance,
    workspace,
    updater,
    incmixApi,
    dataSnapshot,
  ]);

  return (
    <chakra.iframe
      onClick={onMoveToTop}
      flexGrow="1"
      src={`/api/plugins/${widget.pluginId}/widgets/${widget.id}`}
      onLoad={() => {
        const localWidgetRenderer = (iframe.current?.contentWindow as any)
          .INCMIX_WIDGET_RENDERER;
        if (!localWidgetRenderer)
          throw new Error(
            `Unable to find widgetRenderer for widget: ${widget.id}`,
          );
        setWidgetRenderer(localWidgetRenderer);
      }}
      ref={iframe}
    />
  );
};

const DragSideHandle = ({
  min,
  x,
  onResize,
}: {
  min?: boolean;
  x?: boolean;
  onResize: (growth: Bounds) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const locked = usePointerLock(
    ref,
    useMemo(
      () => ({
        handlePointerMove: (e) => {
          onResize(
            min && x
              ? Bounds.minX(e.movementX)
              : min && !x
              ? Bounds.minY(e.movementY)
              : !min && x
              ? Bounds.maxX(e.movementX)
              : Bounds.maxY(e.movementY),
          );
        },
      }),
      [min, x, onResize],
    ),
  );

  return (
    <chakra.div
      ref={ref}
      style={{
        [x ? "height" : "width"]: "100%",
        [x ? "width" : "height"]: "10px",
        [x && min
          ? "left"
          : x && !min
          ? "right"
          : !x && min
          ? "top"
          : "bottom"]: "0",
        transform: `translate(${!x ? "0" : min ? "-80%" : "80%"}, ${
          x ? "0" : min ? "-80%" : "80%"
        })`,
        cursor: x ? "ew-resize" : "ns-resize",
      }}
      position="absolute"
    />
  );
};

const DragCornerHandle = ({
  left,
  top,
  onResize,
}: {
  left?: boolean;
  top?: boolean;
  onResize: (growth: Bounds) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const locked = usePointerLock(
    ref,
    useMemo(
      () => ({
        handlePointerMove: (e) => {
          const movement = Vec2.create(e.movementX, e.movementY);
          onResize(
            left && top
              ? Bounds.topLeft(movement)
              : left && !top
              ? Bounds.bottomLeft(movement)
              : !left && top
              ? Bounds.topRight(movement)
              : Bounds.bottomRight(movement),
          );
        },
      }),
      [left, top, onResize],
    ),
  );

  return (
    <chakra.div
      ref={ref}
      style={{
        [top ? "top" : "bottom"]: "0",
        [left ? "left" : "right"]: "0",
        transform: `translate(${left ? "-80%" : "80%"}, ${
          top ? "-80%" : "80%"
        })`,
        cursor:
          top && left
            ? "nw-resize"
            : top && !left
            ? "ne-resize"
            : !top && left
            ? "sw-resize"
            : "se-resize",
      }}
      position="absolute"
      width="10px"
      height="10px"
    />
  );
};

const ErrorFallback = (props: { error: Error }) => (
  <chakra.div>An error occurred: {props.error.message}</chakra.div>
);

export default RenderWidgetInstance;
