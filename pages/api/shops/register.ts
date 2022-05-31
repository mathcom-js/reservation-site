import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";
import { withSession } from "../../../libs/withSession";
import { isNullObj } from "../../../libs/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { name, startTime, endTime, description, location, imageId },
    } = req;

    try {
      const registeredShop = await client.shop.create({
        data: {
          user: { connect: { id: req.session.user?.id } },
          name,
          startTime,
          endTime,
          description,
          location,
          imageId,
        },
      });

      res.json({ ok: true, registeredShop });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}

export default withSession(handler);
