import {
  Button,
  FormLabel,
  Input,
  Link,
  Modal,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import cuid from "cuid";
import produce from "immer";
import NextLink from "next/link";
import { useContext } from "react";

import { authContext } from "../../lib/auth/hooks/authContext";
import { CreateNewSiteModal } from "./CreateNewSiteModal";
import { useSite } from "./SitesProvider";

export function SiteList() {
  const { user } = useContext(authContext);
  const { sites, isLoading, error, setSites } = useSite();

  return (
    <>
      {user && <CreateNewSiteModal />}
      {isLoading && <Spinner />}
      {user && sites && (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sites.map((siteData) => (
              <Tr key={siteData.id}>
                <Td color="blue">
                  <Link as={NextLink} href={`/sites/${siteData.id}`}>
                    {siteData.name}
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {error && <Text colorScheme="red">error: {error.status}</Text>}
    </>
  );
}
