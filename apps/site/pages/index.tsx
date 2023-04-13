import { Flex } from "@chakra-ui/react";
import type { NextPage } from "next";

import { TopNavbar } from "../components/Layout";
import { SiteList } from "../components/Site";

const Home: NextPage = () => {
  return (
    <>
      <TopNavbar />
      <SiteList />
    </>
  );
};

export default Home;
