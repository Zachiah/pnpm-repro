import { TextLanguages } from "@incmix/utils";

import { LanguageAndCount } from "./language.types";

export const generateLanguagesAvailable = (data: {
  [textKey: string]: TextLanguages;
}): LanguageAndCount[] => {
  const languagesAvailable: LanguageAndCount[] = [];
  if (!data) return languagesAvailable;
  for (const key in data) {
    if (data[key]) {
      const word = data[key];
      for (const lang in word ?? {}) {
        const foundLanguage = languagesAvailable.find((l) => l.key === lang);
        if (foundLanguage) {
          foundLanguage.count += 1;
        } else {
          languagesAvailable.push({ key: lang, count: 1 });
        }
      }
    }
  }
  return languagesAvailable;
};
