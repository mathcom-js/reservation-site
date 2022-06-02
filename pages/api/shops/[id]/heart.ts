import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
  } = req;

  const foundHeart = await client.heart.findFirst({
    where: {
      likedShopId: +id.toString(),
      createdUserId: user?.id,
    },
  });

  if (foundHeart) {
    await client.heart.delete({
      where: {
        id: foundHeart.id,
      },
    });
  } else {
    await client.heart.create({
      data: {
        createdUser: {
          connect: {
            id: user?.id,
          },
        },
        likedShop: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withSession(handler);
