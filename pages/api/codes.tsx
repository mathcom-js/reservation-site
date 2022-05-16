import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const Redirected_Uri = "http://localhost:3000";
const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const login_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${Redirected_Uri}`;

export default async function KakaoCodes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.redirect(login_url);
  } else {
    res.status(405).end();
  }
}
