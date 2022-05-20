import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function RedirectHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const {
      query: { code },
    } = req;
    const response = await axios.post(
      "/api/tokens",
      { code },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(response);

    return res.status(200).end();
  } else {
    return res.status(405).end();
  }
}
