import { chakra } from "@chakra-ui/react";
import { findNode, insertJsxIntoPageTree, pageNodeToJsx } from "@incmix/utils";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import SelectedPageNodeBreadcrumbs from "../SelectedPageNodeBreadcrumbs";
import UiBuilderContext from "../UiBuilderContext";
import CodeEditor from "./CodeEditor";

const JsxEditor = () => {
  const {
    selectedPageNodeId,
    setPage,
    pageTreeComponentInformations,
    page: { pageTree },
  } = useContext(UiBuilderContext);

  const { pageNodes, rootId } = pageTree;

  const node = useMemo(
    () =>
      selectedPageNodeId
        ? findNode({ nodeId: selectedPageNodeId, pageNodes })!
        : findNode({ nodeId: rootId, pageNodes })!,
    [pageNodes, rootId, selectedPageNodeId],
  );

  const [jsx, setJsx] = useState(() => {
    return pageNodeToJsx({
      nodeId: node.id,
      pageNodes,
      componentInformations: pageTreeComponentInformations,
    });
  });

  const dirty = useRef<boolean>(false);

  useEffect(() => {
    console.log("Set dirty to false");
    dirty.current = false;
    setJsx(
      pageNodeToJsx({
        nodeId: node.id,
        pageNodes,
        componentInformations: pageTreeComponentInformations,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node!.id]);

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <chakra.div>
      <SelectedPageNodeBreadcrumbs />
      {errorMessage ? (
        <chakra.p>
          {errorMessage} - any changes you made won&apos;t take effect until the
          problem is resolved
        </chakra.p>
      ) : (
        <></>
      )}

      <CodeEditor
        value={jsx}
        onChange={(newJsx) => {
          console.log({ newJsx, jsx, dirty: dirty.current });
          if (newJsx === undefined || newJsx === null) return;
          if (newJsx === jsx) {
            return;
          }

          if (!dirty.current) {
            console.log("Setting dirty to true");
            dirty.current = true;
            return;
          }

          setJsx(newJsx);
          if (!newJsx) {
            setErrorMessage("v was undefined");
            return;
          }

          const res = insertJsxIntoPageTree({
            jsx: newJsx,
            pageTree,
            replaceId: node.id,
            componentInformations: pageTreeComponentInformations,
          });

          if (!res.success) {
            setErrorMessage(res.error);
            return;
          }
          setErrorMessage("");
          setPage((p) => ({ ...p, pageTree: res.value }));
        }}
      />
    </chakra.div>
  );
};

export default JsxEditor;
