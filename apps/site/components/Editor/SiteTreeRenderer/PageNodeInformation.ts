import { PageNode, PageTreeComponentInformation } from "@incmix/utils";

export type PageNodeInformation = {
  node: PageNode;
  pageTreeComponentInformation: PageTreeComponentInformation;
  parent: null | {
    parentNode: PageNode;
    areaName: string;
    childIndex: number;
    isLastChild: boolean;
  };
};
