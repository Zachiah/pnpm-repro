import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

import { AuthButton } from "../Auth";

export function TopNavbar() {
  return (
    <Flex p={4} alignItems="center" gap={2} marginBottom="1rem" bg="gray.400">
      <Link href="/">
        <Heading cursor="pointer" size="sm">
          Incmix
        </Heading>
      </Link>
      <Box marginLeft="auto" color="blue">
        <Link href="/users/current-user">My Profile</Link>
      </Box>
      <Box>
        <AuthButton />
      </Box>
    </Flex>
  );
}
