import "react-checkbox-tree/lib/react-checkbox-tree.css";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import {
  FaAngleDown,
  FaAngleRight,
  FaCheckSquare,
  FaRegFile,
  FaRegFolder,
  FaRegFolderOpen,
  FaRegSquare,
} from "react-icons/fa";

import DataSourcesTab from "./DataSourcesTab";
import { LanguageTabUI } from "./language";
import ApiTab from "./OpenApi/ApiTab";
import UiBuilderContext from "./UiBuilderContext";


const fileSystem = [
  {
    value: "/app",
    label: "app",
    selected: true,
    children: [
      {
        value: "/app/Http",
        label: "Http",
        selected: true,
        children: [
          {
            value: "/app/Http/Controllers",
            label: "Controllers",
            selected: true,
            children: [
              {
                value: "/app/Http/Controllers/WelcomeController.js",
                label: "WelcomeController.js",
                selected: true,
              },
            ],
          },
          {
            value: "/app/Http/routes.js",
            label: "routes.js",
            selected: true,
          },
        ],
      },
      {
        value: "/app/Providers",
        label: "Providers",
        selected: true,
        children: [
          {
            value: "/app/Providers/EventServiceProvider.js",
            label: "EventServiceProvider.js",
            selected: true,
          },
        ],
      },
    ],
  },
  {
    value: "/config",
    label: "config",
    selected: true,
    children: [
      {
        value: "/config/app.js",
        label: "app.js",
        selected: true,
      },
      {
        value: "/config/database.js",
        label: "database.js",
        selected: true,
      },
    ],
  },
  {
    value: "/public",
    label: "public",
    selected: true,
    children: [
      {
        value: "/public/assets/",
        label: "assets",
        selected: true,
        children: [
          {
            value: "/public/assets/style.css",
            label: "style.css",
            selected: true,
          },
        ],
      },
      {
        value: "/public/index.html",
        label: "index.html",
      },
    ],
  },
  {
    value: "/.env",
    label: ".env",
    selected: true
  },
  {
    value: "/.gitignore",
    label: ".gitignore",
  },
  {
    value: "/README.md",
    label: "README.md",
  },
];

type fileSystemType = {
  value: string;
  label: string;
  children?: fileSystemType[];
  selected?: boolean;
};

const getSelected = (fileSystem: fileSystemType[]) => {
  const traverseObj = (obj: fileSystemType): string | string[] => {
    if (obj && !obj.hasOwnProperty("children")) {
      if (obj.selected) {
        return obj.value;
      }
    }

    const arr = obj.children?.map((obj) => traverseObj(obj));
    return arr?.flat()!;
  };

  return fileSystem
    .map((obj) => traverseObj(obj))
    .flat()
    .filter((item) => item !== undefined);
};

const SettingsTab = () => {
  const { site, setSite } = useContext(UiBuilderContext);
  const [checked, setChecked] = useState<string[]>(getSelected(fileSystem));
  const [expanded, setExpanded] = useState<string[]>([]);
  const onCheck = (value: string[]) => {
    setChecked(value);
  };

  const onExpand = (value: string[]) => {
    setExpanded(value);
  };

  return (
    <chakra.div>
      <Heading as="h2" size="md" m="10px">
        Settings
      </Heading>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Variables
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <CheckboxTree
              checked={checked}
              expanded={expanded}
              expandOnClick
              nodes={fileSystem}
              onCheck={onCheck}
              onExpand={onExpand}
              // onlyLeafCheckboxes
              icons={{
                check: <FaCheckSquare className="rct-icon rct-icon-check" />,
                uncheck: <FaRegSquare className="rct-icon rct-icon-uncheck" />,
                halfCheck: (
                  <FaCheckSquare
                    className="rct-icon rct-icon-half-check"
                    style={{ color: "grey" }}
                  />
                ),
                expandClose: (
                  <FaAngleRight className="rct-icon rct-icon-expand-close" />
                ),
                expandOpen: (
                  <FaAngleDown className="rct-icon rct-icon-expand-open" />
                ),
                expandAll: (
                  <FaAngleDown className="rct-icon rct-icon-expand-all" />
                ),
                collapseAll: (
                  <span className="rct-icon rct-icon-collapse-all" />
                ),
                parentClose: (
                  <FaRegFolder className="rct-icon rct-icon-parent-close" />
                ),
                parentOpen: (
                  <FaRegFolderOpen className="rct-icon rct-icon-parent-open" />
                ),
                leaf: <FaRegFile className="rct-icon rct-icon-leaf" />,
              }}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Language
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <LanguageTabUI />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Data Sources
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <DataSourcesTab />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              APIS
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ApiTab />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Other Settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <FormControl p="2">
              <FormLabel>Google Maps Api Key</FormLabel>
              <Input
                value={site.settings.googleMapsApiKey ?? ""}
                onChange={(e) => {
                  setSite({
                    ...site,
                    settings: {
                      ...site.settings,
                      googleMapsApiKey: e.currentTarget.value,
                    },
                  });
                }}
              />
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </chakra.div>
  );
};

export default SettingsTab;
