import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";
import { withSession } from "../../../libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { name },
    } = req;

    const foundUser = await client.user.findFirst({
      where: {
        username: name.toString(),
      },
    });

    if (foundUser) {
      req.session.user = {
        id: foundUser.id,
        username: foundUser.username,
        avatarId: foundUser.avatarId ? foundUser.avatarId : undefined,
      };
      await req.session.save();
      res.json({ ok: true, foundUser });
    } else {
      res.json({ ok: false });
    }
  }

  if (req.method === "POST") {
    const {
      body: { name },
    } = req;

    const foundUser = await client.user.findFirst({
      where: {
        username: name.toString(),
      },
    });

    if (foundUser) {
      res.json({ ok: false });
    } else {
      const newUser = await client.user.create({
        data: {
          username: name,
        },
      });
      res.json({ ok: true, newUser });
    }
  }
}

export default withSession(handler);
