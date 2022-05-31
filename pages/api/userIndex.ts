import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";
import { withSession } from "../../libs/withSession";
import { isNullObj } from "../../libs/utils";

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
    console.log(userWithDetails);

    if (userWithDetails) {
      res.json({ ok: true, userWithDetails });
    } else {
      res.json({ ok: false });
    }
  }
}

export default withSession(handler);
