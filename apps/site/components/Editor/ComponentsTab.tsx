import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Flex,
  Input,
  useColorModeValue
} from "@chakra-ui/react";
import { combineDndId, PageTreeComponentBlock } from "@incmix/utils";
import { ChangeEvent, FunctionComponent, useContext, useState } from "react";

import DraggableComponentBlock from "./DraggableComponentBlock";
import UiBuilderContext from "./UiBuilderContext";

const filterSearchedComponents = (
  ComponentBlocks: PageTreeComponentBlock[],
  searchedValue: string,
) => {
  return ComponentBlocks.filter((cb) =>
    cb.title.toLowerCase().includes(searchedValue.toLowerCase()),
  );
};

const ComponentsTab: FunctionComponent<{
  layouts?: boolean;
}> = ({ layouts = false }) => {
  const { pageTreeComponentBlocks, editMode } = useContext(UiBuilderContext);
  const [searchedValue, setSearchedValue] = useState("");
  const componentCategories = [
    "form",
    "feedback",
    "media",
    "data-display",
    "disclosure",
  ];
  const usingPageTreeComponentBlocks = pageTreeComponentBlocks.filter((ptcb) =>
    layouts ? ptcb.category === "layout" : ptcb.category !== "layout",
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchedValue(e.target.value);
  };

  const boxShadow = useColorModeValue('rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px', 'rgba(255,255,255, 0.2) 0px 0px 5px 0px, rgba(255,255,255, 0.2) 0px 0px 1px 0px;')

  return (
    <>
      <Input
        value={searchedValue}
        onChange={handleSearch}
        placeholder={`Search ${layouts ? "Layout" : "Components"}`}
        mb="4"
      />
      {searchedValue ? (
        <chakra.section
          display="flex"
          w="100%"
          flexWrap="wrap"
          justifyContent="space-center"
          gap="10px"
          p="5px"
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.300",
            },
            height: "85vh",
            overflowY: "scroll",
          }}
        >
          {filterSearchedComponents(
            usingPageTreeComponentBlocks,
            searchedValue,
          ).map((compBlock) => (
            <Box
              flexBasis="48%"
              h="150px"
              overflow="hidden"
              key={combineDndId("sidebar", compBlock.id)}
              boxShadow={boxShadow}
            >
              <DraggableComponentBlock
                editMode={editMode}
                compBlock={compBlock}
              />
            </Box>
          ))}
        </chakra.section>
      ) : (
        <>
          {usingPageTreeComponentBlocks[0].category === "layout" ? (
            <chakra.section
              display="flex"
              w="100%"
              flexWrap="wrap"
              justifyContent="space-center"
              gap="10px"
              p="5px"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray.300",
                },
                height: "85vh",
                overflowY: "scroll",
              }}
            >
              <>
                {usingPageTreeComponentBlocks.map((compBlock) => (
                  <Box
                    flexBasis="48%"
                    h="150px"
                    overflow="hidden"
                    key={combineDndId("sidebar", compBlock.id)}
                    boxShadow={boxShadow}
                  >
                    <DraggableComponentBlock
                      editMode={editMode}
                      compBlock={compBlock}
                    />
                  </Box>
                ))}
              </>
            </chakra.section>
          ) : (
            <chakra.section
              display="block"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray.300",
                },
                height: "85vh",
                overflowY: "scroll",
              }}
            >
              <>
                <Accordion allowToggle>
                  {componentCategories.map((compCat) => (
                    <AccordionItem key={compCat}>
                      <h1>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {compCat.toUpperCase()}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h1>
                      <AccordionPanel>
                        <Flex
                          w="100%"
                          wrap="wrap"
                          justify="space-center"
                          alignItems="center"
                          gap="10px"
                        >
                          {usingPageTreeComponentBlocks
                            .filter((ptcb) => ptcb.category === compCat)
                            .map((compBlock) => (
                              <Box
                                flexBasis="48%"
                                h="150px"
                                overflow="hidden"
                                key={combineDndId("sidebar", compBlock.id)}
                                boxShadow={boxShadow}
                              >
                                <DraggableComponentBlock
                                  compBlock={compBlock}
                                  editMode={editMode}
                                />
                              </Box>
                            ))}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            </chakra.section>
          )}
        </>
      )}
    </>
  );
};

export default ComponentsTab;
