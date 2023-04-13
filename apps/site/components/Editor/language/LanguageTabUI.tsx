import {
  Code,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";

import UiBuilderContext from "../UiBuilderContext";
import { LanguageManagerUI } from "./LanguageManager";
import { LanguageTextsManager } from "./LanguageTextsManager";
import { SiteLanguage } from "./SiteLanguage";

export const LanguageTabUI: FunctionComponent = () => {
  const { site } = useContext(UiBuilderContext);

  if (!site)
    return (
      <>
        <Code>UiBuilderContext</Code> is needed to render this component.
      </>
    );

  return (
    <>
      <Tabs size="sm">
        <TabList>
          <Tab fontSize="xs">Available Languages</Tab>
          <Tab fontSize="xs">Available Translations</Tab>
          <Tab fontSize="xs">Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <LanguageManagerUI />
          </TabPanel>
          <TabPanel>
            <LanguageTextsManager />
          </TabPanel>
          <TabPanel>
            <SiteLanguage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
