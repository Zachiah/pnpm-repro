import {
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import produce from "immer";
import React from "react";

import { useFetch } from "../../lib/auth/hooks";
import { SiteData } from "./types";

export const ManageTeam: React.FC<{
  site: SiteData;
  setSite: (site: SiteData) => void;
}> = ({ site, setSite }) => {
  const updateSiteRequest = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sites/update-users`;
    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ users: site.editors, id: site.id }),
    });

    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const { isLoading, error, execute } = useFetch<SiteData, { data: any }>(
    updateSiteRequest,
    {
      autoFetch: false,
    },
  );

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Full Name</Th>
            <Th>Email</Th>
            <Th>Is Admin</Th>
            <Th>Read</Th>
            <Th>Write</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {site.editors.map((editor, i) => (
            <Tr key={editor.user.id}>
              <Td>
                {`${editor.user.first_name} ${editor.user.last_name || ""}`}
              </Td>
              <Td>{`${editor.user.email}`}</Td>
              <Td>
                <input
                  type="checkbox"
                  checked={editor.is_owner}
                  onChange={(e) => {
                    setSite(
                      produce(site, (prev) => {
                        prev.editors[i].is_owner = e.currentTarget.checked;
                        return prev;
                      }),
                    );
                  }}
                />
              </Td>
              <Td>
                <input
                  type="checkbox"
                  checked={editor.can_read}
                  onChange={(e) => {
                    setSite(
                      produce(site, (prev) => {
                        prev.editors[i].can_read = e.currentTarget.checked;
                        return prev;
                      }),
                    );
                  }}
                />
              </Td>
              <Td>
                <input
                  type="checkbox"
                  checked={editor.can_write}
                  onChange={(e) => {
                    setSite(
                      produce(site, (prev) => {
                        prev.editors[i].can_write = e.currentTarget.checked;
                        return prev;
                      }),
                    );
                  }}
                />
              </Td>
              <Td>
                <input
                  type="checkbox"
                  checked={editor.can_delete}
                  onChange={(e) => {
                    setSite(
                      produce(site, (prev) => {
                        prev.editors[i].can_delete = e.currentTarget.checked;
                        return prev;
                      }),
                    );
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt="4" justifyContent="flex-end">
        <Button
          colorScheme="blue"
          isLoading={isLoading}
          onClick={() => execute()}
        >
          Update
        </Button>
      </Flex>
      {error && <Text>error: {error.status}</Text>}
    </>
  );
};
