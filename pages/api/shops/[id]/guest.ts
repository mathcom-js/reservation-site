import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  const shop = await client.shop.findUnique({
    where: {
      id: +id,
    },
    include: {
      _count: {
        select: {
          hearts: true,
        },
      },
      Reviews: {
        select: {
          id: true,
          review: true,
          score: true,
          createdUserId: true,
          createdUser: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  res.json({ ok: true, shop });
}

export default withHandler({ method: ["GET"], fn: handler, isSession: false });
