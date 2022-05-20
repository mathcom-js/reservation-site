import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { stringify } from "querystring";
import dotenv from "dotenv";
dotenv.config();

/* REST_API_KEY → Client ID
   CLIENT_SECRET → Client Secret Key */
const Redirected_Uri = "http://localhost:3000/RedirectHandler";
const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

export default async function Tokens(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const code = req.body.code;
    // Must use stringify → but why?
    const payload = stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirected_uri: Redirected_Uri,
      code: code,
      client_secret: CLIENT_SECRET,
    });

    const {
      data: { access_token, refresh_token },
    } = await axios("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: payload,
    });

    const {
      data: {
        id,
        properties: { nickname },
      },
    } = await axios("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.send({ ok: true, id, nickname });
  } else {
    return res.status(405).end();
  }
}
