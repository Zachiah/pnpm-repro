import { chakra } from "@chakra-ui/system";
import React from "react";

const EmptyPlaceholder: React.FC<{
  text: string;
  onClick: (e: any) => void;
}> = ({ text, onClick }) => {
  return (
    <chakra.button
      padding="5px"
      backgroundColor="gray.100"
      fontWeight="normal"
      opacity=".7"
      textAlign="center"
      border="1px solid"
      borderColor="gray.400"
      onClick={onClick}
      w="full"
    >
      {text}
    </chakra.button>
  );
};

export default EmptyPlaceholder;
