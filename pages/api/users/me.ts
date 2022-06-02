import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";
import { withSession } from "../../../libs/withSession";
import { isNullObj } from "../../../libs/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const userWithDetails = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        reviews: true,
        shops: true,
        hearts: {
          select: {
            likedShopId: true,
          },
        },
      },
    });

    if (userWithDetails) {
      res.json({ ok: true, userWithDetails });
    } else {
      res.json({ ok: false });
    }
  }

  if (req.method === "PUT") {
    const {
      body: { username, avatarId },
      session: { user },
    } = req;
    try {
      const block =
        avatarId && !isNullObj(avatarId)
          ? {
              username,
              avatarId,
            }
          : { username };

      const updatedUser = await client.user.update({
        where: {
          id: user?.id,
        },
        data: block,
      });

      req.session.user = {
        id: user?.id!,
        username: username,
        avatarId: updatedUser.avatarId ? updatedUser.avatarId : undefined,
      };
      await req.session.save();

      res.json({ ok: true, updatedUser });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}

export default withSession(handler);
