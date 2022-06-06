import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

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

  if (req.method === "POST") {
    const {
      query: { id },
      body: { score, review },
      session: { user },
    } = req;
    console.log(score);

    try {
      const registeredReview = await client.review.create({
        data: {
          review,
          createdUser: { connect: { id: user?.id } },
          commentedShop: { connect: { id: +id } },
          score: +score,
        },
      });

      res.json({ ok: true, registeredReview });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }

  if (req.method === "DELETE") {
    const {
      query: { id },
      session: { user },
    } = req;

    try {
      const deletedShop = await client.shop.delete({
        where: { id: +id },
      });

      res.json({ ok: true, deletedShop });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}

export default withSession(handler);
