import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/withSession";
import axios from "axios";
import { withHandler } from "@libs/withHandler";

const YOUR_LOGOUT_REDIRECT_URI = "http://localhost:3000/login";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ ok: true });
}

export default withSession(withHandler({ method: ["POST"], fn: handler }));
