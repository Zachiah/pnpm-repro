// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import converter from "swagger2openapi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(404).json("Method get not supported");
  } else {
    const apiDoc = req.body;
    res.status(200).json((await converter.convertObj(apiDoc, {})).openapi);
  }
}
