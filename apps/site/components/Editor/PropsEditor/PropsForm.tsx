import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv6";
import produce from "immer";
import { ReactNode, useContext, useEffect, useId, useRef } from "react";

import UiBuilderContext from "../UiBuilderContext";
import numberOfKeys from "./numberOfKeys";
import PropsEditorContext from "./PropsEditorContext";

const PropsForm = (props: {
  schema: { [key: string]: any };
  formData: { [key: string]: any };
  propsKey: "dataProps" | "styleProps" | "layoutProps" | "textualProps";
  title: string;
  children?: ReactNode;
  transformData: (d: any) => Record<string, any>;
}) => {
  const { pageNodeIndex, componentInformation } =
    useContext(PropsEditorContext);
  const { setPage, page } = useContext(UiBuilderContext);
  const propsFormRef = useRef<{ submit: () => void }>(null);
  const id = useId();

  useEffect(() => {
    const formEl = document.getElementById(`form-${id}`);

    const handleDataSelect = (e: HTMLElementEventMap["input"]) => {
      console.log("Handling");
      if (e.target instanceof HTMLElement && e.target.tagName === "SELECT") {
        setTimeout(() => propsFormRef.current?.submit(), 0);
      }
    };

    formEl?.addEventListener("input", handleDataSelect);
    return () => {
      formEl?.removeEventListener("input", handleDataSelect);
    };
  });

  return (
    <AccordionItem
      isDisabled={props.schema ? numberOfKeys(props.schema) === 0 : true}
    >
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {props.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Form
          id={`form-${id}`}
          // @ts-ignore
          ref={propsFormRef}
          onBlur={() => propsFormRef.current?.submit()}
          validator={validator}
          schema={{
            type: "object",
            properties: props.schema,
          }}
          uiSchema={
            props.propsKey === "layoutProps"
              ? {}
              : props.propsKey === "textualProps"
              ? {
                  "ui:options": {
                    chakra: {
                      p: "1rem",
                      color: "blue.200",
                      sx: {
                        margin: "0 auto",
                      },
                    },
                  },
                }
              : Object.fromEntries(
                  componentInformation[props.propsKey].map((prop) => [
                    prop.propName,
                    prop.uiSchema,
                  ]),
                )
          }
          formData={props.formData}
          onSubmit={(data) => {
            console.log("SUBMIT", data.formData);

            setPage(
              produce(page, (draftPage) => {
                draftPage.pageTree.pageNodes[pageNodeIndex].props[
                  props.propsKey
                ] = props.transformData(data.formData);
              }),
            );
          }}
        />

        {props.children}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default PropsForm;
