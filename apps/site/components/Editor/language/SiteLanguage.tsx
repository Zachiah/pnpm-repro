import { HStack, Select, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useContext, useEffect, useState } from "react";

import UiBuilderContext from "../UiBuilderContext";
import { generateLanguagesAvailable } from "./language.common";

export const SiteLanguage: FunctionComponent = () => {
  const { site, languageCode, setLanguageCode } = useContext(UiBuilderContext);
  const [languages, setLanguages] = useState(
    generateLanguagesAvailable(site?.textDataBase),
  );

  const [selectedOption, setSelectedOption] = useState(languageCode);

  const handleSelectChange = (e: any) => {
    setSelectedOption(e.target.value);
    setLanguageCode(e.target.value);
  };

  if (!site) {
    throw new Error("UiBuilderContext is needed to render this component.");
  }

  useEffect(
    () => setLanguages(generateLanguagesAvailable(site?.textDataBase)),
    [site?.textDataBase],
  );

  return (
    <>
      <VStack>
        <Text as="u" fontSize="2xl">
          Manage site language
        </Text>
        <HStack>
          <Text>Currently selected language key:</Text>
          <code>{selectedOption}</code>
        </HStack>
        <HStack>
          <Text>Select language</Text>
          <Select onChange={(e) => handleSelectChange(e)}>
            {languages.map((language) => (
              <option key={language.key} value={language.key}>
                {language.key}
              </option>
            ))}
          </Select>
        </HStack>
      </VStack>
    </>
  );
};
