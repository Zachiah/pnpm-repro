import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { createEmptyStaticDataSource } from "@incmix/utils";
import { FunctionComponent, useContext, useState } from "react";

import StaticDataSourceEditor from "./StaticDataSourceEditor";
import StaticDataSourceList from "./StaticDataSourceList";
import UiBuilderContext from "./UiBuilderContext";

const DataSourcesTab: FunctionComponent = () => {
  const {
    site,
    setSite,
    selectedStaticDataSourceId,
    setSelectedStaticDataSourceId,
  } = useContext(UiBuilderContext);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Modal
        isOpen={!!selectedStaticDataSourceId}
        onClose={() => setSelectedStaticDataSourceId(null)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay maxW="90%" />
        <ModalContent>
          <ModalHeader>Create DataSource</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StaticDataSourceEditor />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Tabs index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab fontSize="xs">APIs</Tab>
          <Tab fontSize="xs">State</Tab>
          <Tab fontSize="xs">Derived</Tab>
          <Tab fontSize="xs">Constant</Tab>
        </TabList>

        <TabPanels>
          {(["api", "state", "derived", "constant"] as const).map((dsType) => (
            <TabPanel key={dsType}>
              <StaticDataSourceList
                items={site.staticDataSources.filter(
                  (sds) => sds.dsType === dsType,
                )}
                caption={`${dsType} Data Sources`}
                onSelect={setSelectedStaticDataSourceId}
                onDelete={(id) =>
                  setSite((draftSite) => {
                    const deletionIndex = draftSite.staticDataSources.findIndex(
                      (item) => item.id !== id,
                    );
                    draftSite.staticDataSources.splice(deletionIndex, 1);
                  })
                }
                onCreate={() => {
                  setSite((draftSite) => {
                    const newDS = createEmptyStaticDataSource({ dsType });

                    draftSite.staticDataSources.push(newDS);
                    setSelectedStaticDataSourceId(newDS.id);
                  });
                }}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default DataSourcesTab;
