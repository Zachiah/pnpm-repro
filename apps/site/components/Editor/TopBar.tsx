import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Spacer } from "@chakra-ui/react";

import ActivePageEditorUsers from "./ActivePageEditorUsers";
import DeviceSelector from "./DeviceSelector";
import PageSelector from "./PageSelector";
import SettingsButton from "./SettingsButton";
import SiteSelector from "./SiteSelector";
import SiteToolbarButtons from "./SiteToolbarButtons";
import ToggleOutline from "./ToggleOutline";

const TopBar = () => {
  return (
    <Flex p={4} alignItems="center" gap={2} bg="gray.400">
      <IconButton aria-label="Toggle Sidebar" icon={<HamburgerIcon />} />
      <SiteSelector />
      <PageSelector />
      <SettingsButton />
      <Spacer />
      <ToggleOutline />
      <Spacer />
      <DeviceSelector />
      <SiteToolbarButtons />
      <ActivePageEditorUsers />
    </Flex>
  );
};

export default TopBar;
