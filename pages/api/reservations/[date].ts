import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { date },
  } = req;

  const unAvailables = await client.reservation.findMany({
    where: {
      date: date.toString(),
    },
    select: {
      time: true,
    },
  });
  res.json({ ok: true, unAvailables });
}
