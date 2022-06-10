import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { date, id },
  } = req;

  const unAvailables = await client.reservation.findMany({
    where: {
      reservationShopId: +id.toString(),
      date: date.toString(),
    },
    select: {
      time: true,
    },
  });
  res.json({ ok: true, unAvailables });
}
