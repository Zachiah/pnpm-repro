import { TextLanguages } from "@incmix/utils";

export type TextAndLanguages = {
  key: string;
  languages: string[];
};

const regex = /^[a-zA-Z0-9_]+$/;
export const testInvalidKey = (key: string) => {
  return !regex.test(key);
};

export const testKeyExists = (key: string, obj: Record<string, any>) => {
  return Object.keys(obj).includes(key);
};

export const generateTranslationsForLanguageKey = (data: {
  [textKey: string]: TextLanguages;
}): TextAndLanguages[] => {
  const keyAndLanguages: TextAndLanguages[] = [];
  if (!data) return keyAndLanguages;
  for (const key in data) {
    if (data[key]) {
      const word = data[key];
      for (const lang in word ?? {}) {
        const translation = keyAndLanguages.find((l) => l.key === key);
        if (translation) {
          translation.languages.push(lang);
        } else {
          keyAndLanguages.push({ key, languages: [lang] });
        }
      }
    }
  }
  return keyAndLanguages;
};
