import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { kakaoId, username },
  } = req;

  const foundUser = await client.user.findUnique({
    where: {
      kakaoId: kakaoId.toString(),
    },
  });

  if (foundUser) {
    req.session.user = {
      id: foundUser.id,
      username: foundUser.username,
      avatarId: foundUser.avatarId ? foundUser.avatarId : undefined,
    };
    await req.session.save();
    res.json({ ok: true });
  } else {
    const newUser = await client.user.create({
      data: {
        kakaoId: kakaoId.toString(),
        username,
      },
    });
    if (newUser) {
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        avatarId: newUser.avatarId ? newUser.avatarId : undefined,
      };
      await req.session.save();
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }
}

export default withSession(
  withHandler({ method: ["POST"], fn: handler, isSession: false })
);
