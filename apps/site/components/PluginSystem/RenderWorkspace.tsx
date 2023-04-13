import { chakra } from "@chakra-ui/react";
import { Bounds, Incmix, Vec2 } from "@incmix/utils";
import cuid from "cuid";
import produce from "immer";
import { useMemo, useRef, useState } from "react";

import { useElSize, usePointerLock, useShortcuts } from "./hooks";
import RenderWidgetInstance from "./RenderWidgetInstance";
import WorkspaceToolbar from "./WorkspaceToolbar";

const DIST_TRIGGER_CONSTANT = 40;
const normalizeDistTriggerValue = (v: number) => {
  if (v > DIST_TRIGGER_CONSTANT) {
    return 0;
  }

  // TODO: Possibly add easing
  return DIST_TRIGGER_CONSTANT - v;
};

const RenderWorkspace = ({
  workspace,
  widgets,
  setWorkspace,
  incmixApi,
  dataSnapshot,
}: {
  workspace: Incmix.Workspace;
  setWorkspace: (
    w: Incmix.Workspace | ((oldW: Incmix.Workspace) => Incmix.Workspace),
  ) => void;
  widgets: Incmix.Widget[];
  incmixApi: Incmix.Api;
  dataSnapshot: Incmix.Api["staticData"];
}) => {
  const [scrollPos, setScrollPos] = useState<Vec2>(Vec2.ZERO);

  const [scale, setScale] = useState<number>(1);
  const gridSize = `${scale * 10}rem`;

  // useEffect(() => {
  //   console.log(scale.toFixed(2), Vec2.prettyPrint(scrollPos));
  // }, [scale, scrollPos]);

  useShortcuts({
    handleGrow: () => {
      setScale((scale) => scale * (5 / 4));
    },
    handleShrink() {
      setScale((scale) => scale * (4 / 5));
    },
  });

  const wrapperDivRef = useRef<HTMLDivElement | null>(null);
  const wrapperDivSize = useElSize(wrapperDivRef);
  const workspaceScreenBounds = wrapperDivSize
    ? Bounds.fromCenterSize(scrollPos, Vec2.mult(wrapperDivSize, 1 / scale))
    : null;

  const locked = usePointerLock(
    wrapperDivRef,
    useMemo(
      () => ({
        handlePointerMove(e) {
          setScrollPos((scrollPos) =>
            Vec2.sub(scrollPos, { x: e.movementX, y: e.movementY }),
          );
        },
      }),
      [],
    ),
  );

  return (
    <chakra.div
      display="flex"
      flexDir="column"
      h="100%"
      sx={{
        "--grid-line-thickness": ".05rem",
        "--grid-line-color": "rgba(255,255,255,0.5)",
      }}
      backgroundImage="linear-gradient(var(--grid-line-color) var(--grid-line-thickness), transparent var(--grid-line-thickness)), linear-gradient(90deg, var(--grid-line-color) var(--grid-line-thickness), transparent var(--grid-line-thickness));"
      backgroundSize={`${gridSize} ${gridSize};`}
      style={{
        backgroundPosition: `${-scrollPos.x * scale}px ${
          -scrollPos.y * scale
        }px`,
      }}
    >
      <WorkspaceToolbar
        workspace={workspace}
        onCreateWidget={(w) => {
          const created = w.createWidgetInstance();
          console.log({ created });
          const size = created.size;
          const actualPos = Bounds.fromCenterSize(scrollPos, size);
          setWorkspace({
            ...workspace,
            widgetInstances: [
              ...workspace.widgetInstances,
              {
                pos: actualPos,
                data: created.data,
                id: cuid(),
                sizeConstraints: created.sizeConstraints,
                toolbar: created.toolbar,
                widgetId: created.widgetId,
              },
            ],
          });
        }}
        widgets={widgets}
      />
      <chakra.div
        ref={wrapperDivRef}
        flexGrow="1"
        position="relative"
        overflow="hidden"
        tabIndex={0}
      >
        <chakra.div
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%,-50%)"
          transitionDuration="200ms"
          opacity={locked ? 1 : 0}
          width="2"
          height="2"
          border="1px solid black"
          zIndex="100"
          background="white"
          borderRadius="full"
          overflow="visible"
        >
          <chakra.div
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
            position="absolute"
            top="-6"
            transform="translate(-50%,-50%)"
            width="max-content"
          >
            {Vec2.prettyPrint(scrollPos)}
          </chakra.div>
        </chakra.div>

        <chakra.div
          position="absolute"
          overflow="visible"
          width="0px"
          height="0px"
          style={{
            left: `calc(${-scrollPos.x * scale}px + 50%)`,
            top: `calc(${-scrollPos.y * scale}px + 50%)`,
            transform: `scale(${scale})`,
          }}
        >
          {workspace.widgetInstances.map((widgetInstance) => (
            <RenderWidgetInstance
              setWorkspace={setWorkspace}
              workspace={workspace}
              incmixApi={incmixApi}
              dataSnapshot={dataSnapshot}
              onClose={() => {
                setWorkspace(
                  produce(workspace, (w) => {
                    w.widgetInstances = w.widgetInstances.filter(
                      (wi) => wi.id !== widgetInstance.id,
                    );
                    // TODO: Maybe notify the widget it is being closed
                    // TODO: Maybe allow the widget to cancel the closure based on a user prompt
                  }),
                );
              }}
              onResize={(growth) => {
                setWorkspace(
                  produce(workspace, (w) => {
                    const wi = w.widgetInstances.find(
                      (wi) => wi.id === widgetInstance.id,
                    );

                    if (!wi) {
                      throw new Error(
                        "This should never happen, wi was not defined",
                      );
                    }

                    const res = Bounds.add(wi.pos, growth);
                    const resSize = Bounds.size(res);

                    const cancelXGrowth =
                      resSize.x < wi.sizeConstraints.min.x ||
                      resSize.x > wi.sizeConstraints.max.x;

                    const cancelYGrowth =
                      resSize.y < wi.sizeConstraints.min.y ||
                      resSize.y > wi.sizeConstraints.max.y;

                    console.log({ cancelXGrowth, cancelYGrowth, resSize });

                    wi.pos = Bounds.add(wi.pos, {
                      min: {
                        x: cancelXGrowth ? 0 : growth.min.x,
                        y: cancelYGrowth ? 0 : growth.min.y,
                      },
                      max: {
                        x: cancelXGrowth ? 0 : growth.max.x,
                        y: cancelYGrowth ? 0 : growth.max.y,
                      },
                    });
                  }),
                );
              }}
              onMoveToTop={() => {
                setWorkspace(
                  produce(workspace, (w) => {
                    console.log("Moving to top");
                    w.widgetInstances = [
                      ...w.widgetInstances.filter(
                        (wi) => wi.id !== widgetInstance.id,
                      ),
                      widgetInstance,
                    ];
                  }),
                );
              }}
              onMove={(delta) => {
                setWorkspace(
                  produce(workspace, (w) => {
                    const wi = w.widgetInstances.find(
                      (wi) => wi.id === widgetInstance.id,
                    );
                    if (!wi)
                      throw new Error(
                        "This should never happen, wi was not defined",
                      );

                    const scaledDelta = Vec2.mult(delta, 1 / scale);

                    wi.pos = Bounds.translate(wi.pos, scaledDelta);

                    if (!workspaceScreenBounds) return;

                    const distScreenEdge: Bounds = {
                      min: Vec2.sub(wi.pos.min, workspaceScreenBounds.min),
                      max: Vec2.sub(workspaceScreenBounds.max, wi.pos.max),
                    };
                    console.log(
                      workspaceScreenBounds.max.y,
                      distScreenEdge.max.y,
                      Bounds.size(workspaceScreenBounds).y,
                    );

                    const distScreenEdgeBools = {
                      min: {
                        x: distScreenEdge.min.x < 20,
                        y: distScreenEdge.min.y < 20,
                      },
                      max: {
                        x: distScreenEdge.max.x < 20,
                        y: distScreenEdge.max.y < 20,
                      },
                    };

                    const res: Vec2 = {
                      x: (
                        scaledDelta.x > 0
                          ? distScreenEdgeBools.max.x
                          : distScreenEdgeBools.min.x
                      )
                        ? scaledDelta.x
                        : 0,
                      y: (
                        scaledDelta.y > 0
                          ? distScreenEdgeBools.max.y
                          : distScreenEdgeBools.min.y
                      )
                        ? scaledDelta.y
                        : 0,
                    };

                    setScrollPos(Vec2.add(scrollPos, res));
                  }),
                );
              }}
              key={widgetInstance.id}
              widgetInstance={widgetInstance}
              widgets={widgets}
            />
          ))}
        </chakra.div>
      </chakra.div>
    </chakra.div>
  );
};

export default RenderWorkspace;
