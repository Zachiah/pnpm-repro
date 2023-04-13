import {
  DataSource,
  OpenApiDefinition,
  Page,
  PageTreeComponentBlock,
  PageTreeComponentInformation,
  Site,
} from "@incmix/utils";
import { createContext } from "react";

const UiBuilderContext = createContext<{
  site: Site;
  setSite: (site: Site | ((site: Site) => void)) => void;

  page: Page;
  setPage: (page: Page | ((page: Page) => void)) => void;

  outlineMode: boolean;
  setOutlineMode: (flag: boolean) => void;

  editMode: boolean;
  setEditMode: (v: boolean) => void;

  selectedPageNodeId: string | null;
  setSelectedPageNodeId: (v: string | null) => void;

  currentDraggingId: string | null;
  setCurrentDraggingId: (newV: string | null) => void;

  pageTreeComponentInformations: PageTreeComponentInformation[];
  pageTreeComponentBlocks: PageTreeComponentBlock[];

  dataSources: DataSource[];

  openApiDefinitions: OpenApiDefinition[];
  setOpenApiDefinitions: (openApiDefinitions: OpenApiDefinition[]) => void;

  languageCode: string;
  setLanguageCode: (languageCode: string) => void;

  selectedStaticDataSourceId: string | null;
  setSelectedStaticDataSourceId: (v: string | null) => void;

  leftSidebarTabIndex: number;
  setLeftSidebarTabIndex: (v: number) => void;

  rightSidebarTabIndex: number;
  setRightSidebarTabIndex: (v: number) => void;

  undoPageModification: null | (() => void);
  redoPageModification: null | (() => void);
  savePage: () => Promise<void>;
  isOpen: boolean,
  onToggle: () => void
}>(undefined!);

export default UiBuilderContext;
