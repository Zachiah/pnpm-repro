import originalFs from "fs";
import fs from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

import {
  getWidgetCssFilePath,
  getWidgetJsFilePath,
  HAPPY_PATH_STRING_MATCHER,
} from "../../../../../lib/plugins/util";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pluginName = req.query.plugin;
  const widgetId = req.query.widgetId;

  if (typeof pluginName !== "string" || typeof widgetId !== "string") {
    return res.status(404);
  }

  if (
    !pluginName.match(HAPPY_PATH_STRING_MATCHER) ||
    !widgetId.match(HAPPY_PATH_STRING_MATCHER)
  ) {
    return res.status(401).send("No File Inclusion Attacks happening here!");
  }

  const widgetFilePath = getWidgetJsFilePath(pluginName, widgetId);
  const widgetCssFilePath = getWidgetCssFilePath(pluginName, widgetId);

  try {
    const text = (await fs.readFile(widgetFilePath)).toString();

    const css = originalFs.existsSync(widgetCssFilePath)
      ? (await fs.readFile(widgetCssFilePath)).toString()
      : "";

    res.status(200).end(`
        <!DOCTYPE html>
        <html>
            <head>
                <script>
                    ${text}
                </script>

                <style>
                    ${css}
                </style>

            </head>
            <body>
                <div id="app"></div>
            </body>
        </html>
    `);
  } catch (e) {
    res.status(404).send(`No such plugin ${pluginName}. ${e}`);
  }
}
