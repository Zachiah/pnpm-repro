import { StaticDataSource } from "@incmix/utils";
import { FunctionComponent, useContext } from "react";

import ApiDataSourceEditor from "./ApiDataSourceEditor";
import ConstantDataSourceEditor from "./ConstantDataSourceEditor";
import DerivedDataSourceEditor from "./DerivedDataSourceEditor";
import StateDataSourceEditor from "./StateDataSourceEditor";
import UiBuilderContext from "./UiBuilderContext";

const StaticDataSourceEditor: FunctionComponent = () => {
  const {
    selectedStaticDataSourceId,
    setSite,
    site,
    setSelectedStaticDataSourceId,
  } = useContext(UiBuilderContext);

  if (!selectedStaticDataSourceId) return <></>;
  const selectedStaticDataSource = site.staticDataSources.find(
    (sds) => sds.id === selectedStaticDataSourceId,
  );

  if (!selectedStaticDataSource) {
    return <></>;
  }

  const setStaticDataSource = (newStaticDataSource: StaticDataSource) => {
    setSite((draftSite) => {
      draftSite.staticDataSources[
        draftSite.staticDataSources.findIndex(
          (ads) => ads.id === selectedStaticDataSource.id,
        )
      ] = newStaticDataSource;
    });
    setSelectedStaticDataSourceId(null);
  };

  if (selectedStaticDataSource.dsType === "api") {
    return (
      <ApiDataSourceEditor
        apiDataSource={selectedStaticDataSource}
        setApiDataSource={setStaticDataSource}
      />
    );
  }

  if (selectedStaticDataSource.dsType === "state") {
    return (
      <StateDataSourceEditor
        stateDataSource={selectedStaticDataSource}
        setStateDataSource={setStaticDataSource}
      />
    );
  }

  if (selectedStaticDataSource.dsType === "constant") {
    return (
      <ConstantDataSourceEditor
        constantDataSource={selectedStaticDataSource}
        setConstantDataSource={setStaticDataSource}
      />
    );
  }

  if (selectedStaticDataSource.dsType === "derived") {
    return (
      <DerivedDataSourceEditor
        derivedDataSource={selectedStaticDataSource}
        setDerivedDataSource={setStaticDataSource}
      />
    );
  }

  throw new Error("Invalid dsType");
};

export default StaticDataSourceEditor;
