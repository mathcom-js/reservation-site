import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ ok: true, logintype: req.session.user?.logintype });
}

export default withSession(withHandler({ method: ["GET"], fn: handler }));
