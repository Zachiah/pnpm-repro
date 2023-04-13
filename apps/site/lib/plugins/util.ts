import path from "path";

export const HAPPY_PATH_STRING_MATCHER = /[a-zA-Z_-]+/;

const getWidgetDir = (sanitized: string) =>
  path.join(getPluginDistDir(sanitized), "widgets");

export const getWidgetJsFilePath = (
  sanitizedPluginName: string,
  sanitizedWidgetName: string,
) => path.join(getWidgetDir(sanitizedPluginName), `${sanitizedWidgetName}.js`);

export const getWidgetCssFilePath = (
  sanitizedPluginName: string,
  sanitizedWidgetName: string,
) => path.join(getWidgetDir(sanitizedPluginName), `${sanitizedWidgetName}.css`);

const getPluginDistDir = (sanitized: string) =>
  path.join(
    process.cwd(),
    "..",
    "..",
    "plugin-helpers",
    "dist",
    sanitized,
    "src",
  );

export const getPluginJsFilePath = (sanitizedPluginName: string) =>
  path.join(getPluginDistDir(sanitizedPluginName), "index.js");
