import type { NextApiRequest, NextApiResponse } from "next";

import findValidApiKey from "@calcom/ee/lib/api/findValidApiKey";
import prisma from "@calcom/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.query.apiKey as string;

  if (!apiKey) {
    return res.status(401).json({ message: "No API key provided" });
  }

  const validKey = await findValidApiKey(apiKey);

  if (!validKey) {
    return res.status(401).json({ message: "API not valid" });
  }

  const id = req.query.id as string; //maybe change that again

  if (req.method === "DELETE") {
    await prisma.webhook.delete({
      where: {
        id,
      },
    });
    res.status(204).json({ message: "Subscription is deleted." });
  }
}
