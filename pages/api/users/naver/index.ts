import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import axios from "axios";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const access_token = req.body.access_token;
  const api_url = "https://openapi.naver.com/v1/nid/me";
  const user_info = await axios({
    method: "GET",
    url: api_url,
    headers: { Authorization: "Bearer " + access_token },
  });
  const {
    response: { id, name },
  } = user_info.data;

  const foundUser = await client.user.findUnique({
    where: {
      naverId: id,
    },
  });

  if (foundUser) {
    req.session.user = {
      id: foundUser.id,
      username: foundUser.username,
      avatarId: foundUser.avatarId ? foundUser.avatarId : undefined,
      logintype: "Naver",
    };
    await req.session.save();
    res.json({ ok: true });
  } else {
    const newUser = await client.user.create({
      data: {
        naverId: id,
        username: name,
      },
    });
    if (newUser) {
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        avatarId: newUser.avatarId ? newUser.avatarId : undefined,
        logintype: "Naver",
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
