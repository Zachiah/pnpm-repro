import { Page } from "@incmix/utils";
import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb";

// export const LayoutPropsJSONSchema = {
//   type: "object",
//   properties: {
//     flexGrow: {
//       type: "number",
//     },
//     margin: {
//       type: "number",
//     },
//   },
// } as const;

// export type PageTree = {
//   rootId: string;
//   pageNodes: PageNode[];
// };

// export type PageNodePropsDataProp =
//   | { type: "dataSource"; id: string }
//   | { type: "static"; value: any }
//   | { type: "empty" };

// export type PageNode = {
//   id: string;
//   componentId: string;
//   groups: string[];
//   editable?: boolean;
//   isInline?: boolean;
//   dropIcon?: string | JSX.Element;
//   alwaysShowDroppable?: boolean;
//   childrenIds: {
//     [key: string]: {
//       ids: string[];
//       acceptableGroups: string[];
//       singleChild: boolean;
//     };
//   };
//   props: {
//     dataProps: Record<string, PageNodePropsDataProp>;
//     styleProps: Record<string, any>;
//     textualProps: Record<string, TextualProp | null>;
//     layoutProps: LayoutProps;
//   };
// };

// const pageNodeSchema = {
//   properties: {
//     id: {
//       type: "string",
//     },
//     componentId: {
//       type: "string",
//     },
//     groups: {
//       type: "array",
//       items: {
//         type: "string",
//       },
//     },
//     editable: {
//       type: "boolean",
//     },
//     isInline: {
//       type: "boolean",
//     },
//     dropIcon: {
//       type: "string",
//     },
//     alwaysShowDroppable: {
//       type: "boolean",
//     },
//     childrenIds: {
//       type: "object",
//       properties: {
//         type: "object",
//         properties: {
//           ids: {
//             type: "array",
//             items: {
//               type: "string",
//             },
//           },
//           acceptableGroups: {
//             type: "array",
//             items: {
//               type: "string",
//             },
//           },
//           singleChild: {
//             type: "boolean",
//           },
//         },
//       },
//     },
//     props: {
//       type: "object",
//       properties: {
//         dataProps: {
//           type: "object",
//         },
//         styleProps: {
//           type: "object",
//         },
//         textualProps: {
//           type: "object",
//         },
//         layoutProps: {
//           type: "object",
//         },
//       },
//     },
//   },
// };


// export type PageTree = {
//   rootId: string;
//   pageNodes: PageNode[];
// };



export type PageTreeCollectionMethods = {
  save: (page: Page) => Promise<void>;
}

export const pageTreeCollectionMethods: PageTreeCollectionMethods = {
  save: async function (this: PageCollection , page: Page) {
    if(!page) return;
    await this.upsert(page);
  }
}

export const pageSchemaLiteral = {
  title: "page schema",
  description: "describes a page",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100 
    },
    pageTree: {
      type: "object",
      properties: {
        rootId: {
          type: "string",
        },
        pageNodes: {
          type: "array",
          items: {
            type: "object",
          }
        },
      },
    },
  },
  required: ["id", "pageTree"],
} as const;


const schemaTyped = toTypedRxJsonSchema(pageSchemaLiteral);
export type PageDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const pageSchema: RxJsonSchema<PageDocType> = pageSchemaLiteral;
export type PageCollection = RxCollection<PageDocType, {}, PageTreeCollectionMethods>;
