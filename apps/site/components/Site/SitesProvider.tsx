import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useFetch } from "../../lib/auth/hooks";
import { authContext } from "../../lib/auth/hooks/authContext";
import { SiteData } from "./types";

interface SitesContext {
  sites: SiteData[];
  setSites: (sites: SiteData[]) => void;
  selectedSite?: SiteData;
  setSelectedSite: (site?: SiteData) => void;
}
export const sitesContext = createContext<SitesContext>({
  sites: [],
  selectedSite: undefined,
  setSites: ([]) => {},
  setSelectedSite: () => {},
});

interface Props {
  children: ReactNode;
}

export const SitesProvider: React.FC<Props> = ({ children }) => {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteData | undefined>();
  return (
    <sitesContext.Provider
      value={{ sites, setSites, selectedSite, setSelectedSite }}
    >
      {children}
    </sitesContext.Provider>
  );
};

export const useSite = () => {
  const { user } = useContext(authContext);
  const { sites, setSites } = useContext(sitesContext);

  const fetchSiteList = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sites/my-sites`;
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    return {
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      data: await resp.json(),
    };
  };

  const { isLoading, error, execute } = useFetch<SiteData[], any>(
    fetchSiteList,
    {
      autoFetch: false,
      onSuccess,
    },
  );

  function onSuccess(data: SiteData[]) {
    setSites(data);
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (user && sites.length < 1) execute();
  //   }, 100);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sites, user]);

  return {
    sites,
    isLoading,
    error,
    setSites,
  };
};
