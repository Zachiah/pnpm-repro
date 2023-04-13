import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Incmix } from "@incmix/utils";

const WorkspaceToolbar = ({
  workspace,
  onCreateWidget,
  widgets,
}: {
  workspace: Incmix.Workspace;
  onCreateWidget(w: Incmix.Widget): void;
  widgets: Incmix.Widget[];
}) => {
  return (
    <chakra.div
      display="flex"
      h="8"
      bg="white"
      color="black"
      alignItems="center"
      padding="1"
      gap="1"
    >
      <Menu closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          colorScheme="blue"
          size="xs"
          aria-label="App Switcher"
          icon={<HamburgerIcon />}
        >
          MenuItem
        </MenuButton>
        <MenuList minWidth="240px">
          {widgets.map((w) => (
            <MenuItem onClick={() => onCreateWidget(w)} key={w.id}>
              {w.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </chakra.div>
  );
};

export default WorkspaceToolbar;
