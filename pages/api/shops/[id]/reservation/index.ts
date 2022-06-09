import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
    body: { time, date },
  } = req;

  /*
  await client.reservation.deleteMany({
    where: {
      end: {
        lt: new Date(),
      },
    },
  });

  const shopUser = await client.shop.findUnique({
    where: {
      id: +id,
    },
    select: {
      userId: true,
    },
  });

  if (shopUser?.userId !== user?.id) {
    const existedMyReservation = await client.reservation.findMany({
      where: {
        reservationUserId: +user?.id!,
        AND: [
          {
            end: {
              gt: start,
            },
            start: {
              lt: end,
            },
          },
        ],
      },
    });

    const existedOtherReservation = await client.reservation.findMany({
      where: {
        reservationShopId: +id,
        AND: [
          {
            end: {
              gt: start,
            },
            start: {
              lt: end,
            },
          },
        ],
      },
    });

    if (
      existedMyReservation.length === 0 &&
      existedOtherReservation.length === 0
    ) { */
  const newReservation = await client.reservation.create({
    data: {
      time,
      date,
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
  /* } else {
      res.json({ ok: false, error: "time" });
    }
  } else {
    res.json({ ok: false, error: "access" });
  }*/
}

export default withSession(handler);
