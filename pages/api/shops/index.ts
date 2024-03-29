import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const shops = await client.shop.findMany({
    include: {
      Reviews: {
        select: {
          score: true,
        },
      },
      _count: {
        select: {
          hearts: true,
        },
      },
    },
  });
  res.json({ ok: true, shops });
}

export default withHandler({ method: ["GET"], fn: handler, isSession: false });
