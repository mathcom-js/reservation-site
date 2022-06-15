import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ ok: true });
}

export default withSession(withHandler({ method: ["POST"], fn: handler }));
