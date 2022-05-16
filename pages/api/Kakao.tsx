import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const Redirected_Uri = "http://localhost:3000";
const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

const URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${Redirected_Uri}`;

async function OAuth(url: string) {}

export default function Kakao(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    OAuth(URL);
    return res.status(200).json({ name: "nothing" });
  } else {
    return res.status(405).end();
  }
}
