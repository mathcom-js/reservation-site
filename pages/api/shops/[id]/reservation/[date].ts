import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

export default withHandler({ method: ["GET"], fn: handler, isSession: false });
