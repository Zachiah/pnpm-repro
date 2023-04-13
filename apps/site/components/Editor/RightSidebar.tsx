import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";

import JsxEditor from "./JsxEditor";
import PropsEditor from "./PropsEditor";
import TreeViewEditor from "./TreeViewEditor";
import UiBuilderContext from "./UiBuilderContext";

const RightSidebar: FunctionComponent = () => {
  const { rightSidebarTabIndex, setRightSidebarTabIndex } =
    useContext(UiBuilderContext);
  return (
    <Tabs
      w="sm"
      h="100%"
      overflow="auto"
      flexShrink="0"
      paddingLeft="2"
      borderLeft="1px solid"
      borderLeftColor="gray.400"
      index={rightSidebarTabIndex}
      onChange={(i) => setRightSidebarTabIndex(i)}
    >
      <TabList>
        <Tab fontSize="xs">Props Editor</Tab>
        <Tab fontSize="xs">Tree View</Tab>
        <Tab fontSize="xs">JSX Editor</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <PropsEditor />
        </TabPanel>
        <TabPanel>
          <TreeViewEditor />
        </TabPanel>
        <TabPanel>
          <JsxEditor />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default RightSidebar;
