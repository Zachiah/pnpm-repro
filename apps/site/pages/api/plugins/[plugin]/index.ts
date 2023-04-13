import * as FileSystem from "@incmix/utils/src/FileSystem";
import { folderToStaticFrontendFolder } from "@incmix/utils/src/FileSystem";
import { existsSync } from "fs";
import fs from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import {
  getPluginJsFilePath,
  HAPPY_PATH_STRING_MATCHER,
} from "../../../../lib/plugins/util";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pluginName = req.query.plugin;

  if (typeof pluginName !== "string") {
    return res.status(404);
  }

  if (!pluginName.match(HAPPY_PATH_STRING_MATCHER)) {
    return res.status(401).send("No File Inclusion Attacks happening here!");
  }
  const pluginPath = getPluginJsFilePath(pluginName);

  if (!existsSync(pluginPath)) {
    res.status(404).send(`No such plugin ${pluginName}.`);
    return;
  }

  const code = (await fs.readFile(pluginPath)).toString();

  res.status(200).end(`
        <!DOCTYPE html>
        <html>
            <head>
                <script>
                    ${code}
                </script>
            </head>
            <body></body>
        </html>
    `);
}
