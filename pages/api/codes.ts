import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
dotenv.config();

// REST_API_KEY → Client ID
const Redirected_Uri = "http://localhost:3000/RedirectHandler";
const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const login_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${Redirected_Uri}`;

export default async function Codes(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await res.redirect(login_url);
  } else {
    res.status(405).end();
  }
}
