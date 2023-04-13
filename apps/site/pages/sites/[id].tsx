import {
  Container,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TopNavbar } from "../../components/Layout";
import { SiteData, useSite } from "../../components/Site";
import { ManageTeam } from "../../components/Site/ManageTeam";
import { useAuth } from "../../lib/auth/hooks/authContext";

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { sites, isLoading, error, setSites } = useSite();
  const [selectedSite, setSelectedSite] = useState<SiteData>();

  useEffect(() => {
    const { id: siteId } = router.query;
    if (!selectedSite) {
      const site = sites.find(({ id }) => id === siteId);
      if (site) setSelectedSite(site);
    }
  }, [sites, router.query, user, selectedSite]);

  return (
    <>
      <TopNavbar />
      <Container maxW="1024px">
        {selectedSite && (
          <Tabs>
            <TabList>
              <Tab fontSize="xs">Details</Tab>
              <Tab fontSize="xs">Team</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>{selectedSite.name}</Text>
              </TabPanel>
              <TabPanel>
                <ManageTeam site={selectedSite} setSite={setSelectedSite} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
        {isLoading && <Spinner />}
        {error && <Text>404: Selected site does not exist</Text>}
      </Container>
    </>
  );
};

export default Home;
