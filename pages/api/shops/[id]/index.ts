import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../libs/client";
import { withSession } from "../../../../libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
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
    const isLiked = Boolean(
      await client.heart.findFirst({
        where: {
          createdUserId: user?.id,
          likedShopId: +id.toString(),
        },
      })
    );
    res.json({ ok: true, shop, isLiked });
  }
}

export default withSession(handler);
