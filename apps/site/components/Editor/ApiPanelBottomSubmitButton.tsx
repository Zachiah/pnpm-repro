import { Button, chakra } from "@chakra-ui/react";

const ApiPanelBottomSubmitButton = ({
  hasChanges,
}: {
  hasChanges: boolean;
}) => (
  <chakra.div position="absolute" width="full" p={6} left={0} bottom={0}>
    <Button
      type="submit"
      colorScheme={hasChanges ? "green" : "gray"}
      disabled={!hasChanges}
      width="full"
    >
      Update
    </Button>
  </chakra.div>
);

export default ApiPanelBottomSubmitButton;
