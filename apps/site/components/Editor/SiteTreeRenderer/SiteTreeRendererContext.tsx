import {
  DataSource,
  PageNode,
  PageTreeComponentInformation,
  Site,
} from "@incmix/utils";
import { createContext } from "react";

const SiteTreeRendererContext = createContext<{
  /** The Page Nodes for the Page */
  pageNodes: PageNode[];

  pageTreeComponentInformations: PageTreeComponentInformation[];
  site: Site;
  dataSources: DataSource[];
  languageCode: string;

  edit: null | {
    inHighlightMode: boolean;
    outlineMode: boolean;

    /** Set the PageNodes for the Page */
    setPageNodes: (pageNodes: PageNode[]) => void;

    setSelectedPageNodeId: (v: string | null) => void;
    selectedPageNodeId: string | null;

    currentDraggingId: string | null;
    setCurrentDraggingId: (v: string | null) => void;

    hoveredNodeId: string | null;
    setHoveredNodeId: (v: string | null) => void;
  };
}>(null as any);

export default SiteTreeRendererContext;
