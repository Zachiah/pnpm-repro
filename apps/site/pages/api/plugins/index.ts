import fs from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pluginNames = (
    await fs.readdir(path.join(process.cwd(), "..", "..", "plugins"))
  ).filter((p) => p !== ".DS_Store");
  return res.status(200).json(pluginNames);
}
