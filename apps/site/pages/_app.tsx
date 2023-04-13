import { ChakraProvider } from "@chakra-ui/react";
import { uiTheme } from '@incmix/theme'
import { enableAllPlugins } from "immer";
import type { AppProps } from "next/app";

import { SitesProvider } from "../components/Site";
import { AuthProvider } from "../lib/auth/hooks/authContext";
import { RxDBProvider } from "../lib/db/context";

enableAllPlugins();

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <ChakraProvider theme={uiTheme()}>
      <RxDBProvider>
      <AuthProvider>
        <SitesProvider>
          <Component {...pageProps} />
        </SitesProvider>
      </AuthProvider>
      </RxDBProvider>
    </ChakraProvider>
  );
}

export default MyApp;
