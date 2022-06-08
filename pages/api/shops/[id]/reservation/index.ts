import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
    body: { start, end },
  } = req;

  await client.reservation.deleteMany({
    where: {
      end: {
        lt: new Date(),
      },
    },
  });

  const newReservation = await client.reservation.create({
    data: {
      start,
      end,
      reservationShop: {
        connect: {
          id: +id.toString(),
        },
      },
      reservationUser: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({ ok: true, newReservation });
}

export default withSession(handler);
