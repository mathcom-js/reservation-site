import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    const shop = await client.shop.findUnique({
      where: {
        id: +id.toString(),
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
}
