import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";
import { withSession } from "../../libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;
  res.json({ ok: true, user });
}

export default withSession(handler);
