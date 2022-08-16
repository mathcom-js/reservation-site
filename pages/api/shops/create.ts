import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  try {
    const registeredShop = await client.shop.create({
      data: {
        user: { connect: { id: req.session.user?.id } },
        ...body,
      },
    });

    res.json({ ok: true, registeredShop });
  } catch (error) {
    res.json({ ok: false, error });
  }
}

export default withSession(withHandler({ method: ["POST"], fn: handler }));
