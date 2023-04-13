import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import produce from "immer";
import React, { FormEvent, useState } from "react";

import { useFetch } from "../../lib/auth/hooks";
import { useSite } from "./SitesProvider";
import { SiteData } from "./types";

export const CreateNewSiteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [siteName, setSiteName] = useState<string>("");

  const { sites, setSites } = useSite();

  const createSiteRequest = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sites`;
    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        name: siteName,
      }),
    });
    return {
      ok: resp.ok,
      status: resp.status,
      data: await resp.json(),
    };
  };

  const { isLoading, error, execute } = useFetch(createSiteRequest, {
    autoFetch: false,
    onSuccess,
  });

  function onSuccess(data: SiteData) {
    setSites(
      produce(sites, (prev) => {
        prev.push(data);
      }),
    );
    setIsOpen(false);
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    execute();
  };

  return (
    <>
      <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
        Create new site
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new site</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={submitForm}>
              <FormLabel htmlFor="name">Site Name</FormLabel>
              <Input
                id="name"
                onChange={(e) => setSiteName(e.currentTarget.value)}
                value={siteName}
                required
                marginBottom={4}
              />
              <Button
                type="submit"
                colorScheme="blue"
                isDisabled={siteName.length < 1}
                isLoading={isLoading}
              >
                Create
              </Button>
            </form>
            {error && <Text color="red">Something went wrong</Text>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
