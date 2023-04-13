import {
  chakra,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useContext } from "react";

import ComponentsTab from "./ComponentsTab";
import SettingsTab from "./SettingsTab";
import UiBuilderContext from "./UiBuilderContext";

const LeftSidebar = () => {
  const { leftSidebarTabIndex, setLeftSidebarTabIndex, isOpen } =
    useContext(UiBuilderContext);

  return (
    <chakra.div
      position="relative"
      shadow="inner"
      w="sm"
      h="100%"
      display="flex"
      flexDir="column"
      borderRight="1px solid"
      borderRightColor="gray.400"
    >
      {!isOpen ? (
        <Tabs
          flexShrink="0"
          h="100%"
          overflow="none"
          index={leftSidebarTabIndex}
          onChange={(i) => setLeftSidebarTabIndex(i)}
          paddingRight="2"
          display="flex"
          flexDir="column"
        >
          <TabList>
            <Tab fontSize="xs">Components</Tab>
            <Tab fontSize="xs">Layouts</Tab>
          </TabList>

          <TabPanels flexGrow="1" overflow="auto">
            <TabPanel p="0">
              <ComponentsTab />
            </TabPanel>

            <TabPanel p="0">
              <ComponentsTab layouts />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <SettingsTab />
      )}
    </chakra.div>
  );
};

export default LeftSidebar;
