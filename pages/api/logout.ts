import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/withSession";
import axios from "axios";

const YOUR_LOGOUT_REDIRECT_URI = "http://localhost:3000/login";

const logout = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    req.session.destroy();
    console.log(res);
    res.json({ ok: true });
  } else return res.status(405).end();
};

export default withSession(logout);
