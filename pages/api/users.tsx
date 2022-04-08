import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await client.user.findMany({});
  res.json({
    ok: true,
    data: {
      users,
    },
  });
}
