import { chakra, Flex, useDisclosure } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import {
  pageTreeComponentBlocks,
  pageTreeComponentInformations,
} from "@incmix/builder-ui";
import {
  addChildAtIndex,
  DerivedDataSource,
  derivedDataSourceToDataSource,
  OpenApiDefinition,
  Page,
  PageNode,
  pageNodeH,
  removeItemFromArray,
  Site,
  splitDndId,
  staticDatasourceToDataSource,
  useSavableHistoryStack,
} from "@incmix/utils";
import produce from "immer";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useImmer } from "use-immer";

import Dragger from "../components/Editor/Dragger";
import LeftSidebar from "../components/Editor/LeftSidebar";
import RightSidebar from "../components/Editor/RightSidebar";
import EditableSiteTreeRenderer from "../components/Editor/SiteTreeRenderer/EditableSiteTreeRenderer";
import TopBar from "../components/Editor/TopBar";
import UiBuilderContext from "../components/Editor/UiBuilderContext";
import { authContext } from "../lib/auth/hooks/authContext";
import { RxDBContext } from "../lib/db/db";

const Home: NextPage = () => {
  const env = process.env.NODE_ENV
  const isDevMode = env === "development"
  const { push, pathname } = useRouter()
  const {  next } = useContext(authContext);
  const db = useContext(RxDBContext);
  useEffect(() => {
    db?.user.findOne()
      .exec()
      .then((doc) => {
        if (!doc && !isDevMode && false){
          next.current = pathname
          push("users/login")
        }
      });
  }, [db]);
  const initialRootNode = pageNodeH(
    pageTreeComponentInformations.find(
      (ptci) => ptci.id === "chakra.PageRoot",
    )!,
  );

  const [editMode, setEditMode] = useState(true);
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const editMode = urlSearchParams.get("data");

    setEditMode(
      editMode === null || editMode === undefined || editMode === "true",
    );
  }, []);

  const [outlineMode, setOutlineMode] = useState(true);
  //const [showSettings, setShowSettings] = useState(false);
  const {isOpen, onToggle} = useDisclosure();

  const {
    save: savePage,
    setValue: _setPage,
    value: page,
    undo: undoPageModification,
    redo: redoPageModification,
  } = useSavableHistoryStack(
    {
      id: "the-page-id",
      pageTree: {
        rootId: initialRootNode.id,
        pageNodes: [initialRootNode],
      },
    },
    {
      async onSave() {
        // TODO: Save the page here!
      },
      onNavigate() {
        setSelectedPageNodeId(null);
      },
    },
  );

  const setPage = (v: Page | ((draft: Page) => void)) => {
    if (typeof v === "function") return _setPage(produce(page, v));
    return _setPage(v);
  };

  const [site, setSite] = useImmer<Site>({
    id: "site-id",
    userDefinedPageTreeComponentInformations: [],
    staticDataSources: [],
    textDataBase: {
      outline: {
        en: "Outline",
        es: "Texto de esquema",
      },
      dataSources: {
        en: "Data Sources",
        es: "Fuentes de datos",
      },
    },
    settings: {
      googleMapsApiKey: null
    }
  });

  const [openApiDefinitions, setOpenApiDefinitions] = useState<
    OpenApiDefinition[]
  >([]);

  const dataSources = useMemo(() => {
    const nonDerivedDataSources = site.staticDataSources
      .filter((ads) => ads.dsType !== "derived")
      .map((ads) =>
        staticDatasourceToDataSource({
          staticDataSource: ads,
          dataSources: [],
          openApiDefinitions,
        }),
      );

    // TODO: This solution won't allow `DerivedDataSource`s to depend on other `DerivedDataSource`s.
    // TODO: Not sure about a way around this at the moment, but their surely is one
    const derivedDataSources = site.staticDataSources
      .filter((sds) => sds.dsType === "derived")
      .map((dds) =>
        derivedDataSourceToDataSource({
          derivedDataSource: dds as DerivedDataSource,
          dataSources: nonDerivedDataSources,
        }),
      );

    return [...nonDerivedDataSources, ...derivedDataSources];
  }, [openApiDefinitions, site.staticDataSources]);

  const [selectedPageNodeId, setSelectedPageNodeId] = useState<string | null>(
    null,
  );

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const dndSensors = useSensors(mouseSensor, touchSensor);

  const onDragEnd = (e: DragEndEvent) => {
    setCurrentDraggingId("");
    if (!e.over || !e.over.data.current) return;
    // New Droppable parent
    const [parentId, childAreaName, index] = splitDndId(e.over.id.toString());
    // Dragged element
    const [location, draggableId] = splitDndId(e.active.id.toString());
    if (parentId === draggableId) return;

    const oldParentId = e.active.data.current?.parentId;
    let comp: PageNode | undefined;
    // if component was dragged from sidebar
    if (location === "sidebar") {
      const compInfo = pageTreeComponentInformations.find(
        (ptci) => ptci.id === e.active.data.current?.componentId,
      )!;
      comp = pageNodeH(compInfo);
      // if component was dragged from page
    } else {
      comp = page.pageTree.pageNodes.find((n) => n.id === draggableId);
    }
    if (!comp || !comp.id) return;

    setPage((prev) => {
      const parent = prev.pageTree.pageNodes.find((n) => n.id === parentId);
      if (!parent) return;

      const { pageNodes } = prev.pageTree;
      if (location === "page") {
        const oldParent = pageNodes.find((n) => n.id === oldParentId);
        if (!oldParent || !comp || !comp.id) return;

        oldParent.childrenIds[childAreaName].ids = removeItemFromArray(
          oldParent.childrenIds[childAreaName].ids,
          comp.id,
        );
      } else pageNodes.push(comp!);
      const children = parent.childrenIds[childAreaName];
      if (children.singleChild && comp?.id) children.ids = [comp?.id];
      else
        children.ids = addChildAtIndex(children.ids, comp?.id, parseInt(index));
    });

    setSelectedPageNodeId(comp.id);
  };

  const [currentDraggingId, setCurrentDraggingId] = useState<string | null>(
    null,
  );

  const [languageCode, setLanguageCode] = useState("en");

  const [selectedStaticDataSourceId, setSelectedStaticDataSourceId] = useState<
    string | null
  >(null);

  const [rightSidebarTabIndex, setRightSidebarTabIndex] = useState(0);
  const [leftSidebarTabIndex, setLeftSidebarTabIndex] = useState(0);
  
  return (
    <UiBuilderContext.Provider
      value={{
        site,
        setSite,
        pageTreeComponentInformations,
        selectedPageNodeId,
        setSelectedPageNodeId,
        editMode,
        outlineMode,
        setOutlineMode,
        setPage,
        page,
        pageTreeComponentBlocks,
        currentDraggingId,
        setCurrentDraggingId,
        dataSources,
        openApiDefinitions,
        setOpenApiDefinitions,
        selectedStaticDataSourceId,
        setSelectedStaticDataSourceId,
        languageCode,
        setLanguageCode,
        rightSidebarTabIndex,
        setRightSidebarTabIndex,
        leftSidebarTabIndex,
        setLeftSidebarTabIndex,
        setEditMode,
        undoPageModification,
        redoPageModification,
        savePage,
        isOpen,
        onToggle
      }}
    >
      <DndContext
        sensors={dndSensors}
        onDragEnd={onDragEnd}
        onDragStart={(e) => {
          setCurrentDraggingId(`${e.active.id}`);
        }}
        collisionDetection={pointerWithin}
      >
        <Flex direction="column" height="100vh">
          <TopBar />
          <Flex flexGrow="1" overflow="auto">
            {editMode && <LeftSidebar />}
            <chakra.div
              flexGrow="1"
              h="100%"
              overflow="auto"
              paddingTop="8"
              overflowX={editMode ? "scroll" : "auto"}
            >
              <EditableSiteTreeRenderer />
            </chakra.div>
            {editMode && <RightSidebar />}
          </Flex>
        </Flex>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
              <Dragger />
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </UiBuilderContext.Provider>
  );
};

export default Home;
