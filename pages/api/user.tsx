import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const {
      query: { name },
    } = req;

    const foundUser = await client.user.findUnique({
      where: {
        username: name.toString(),
      },
    });

    res.json({ ok: true, foundUser });
  }

  if (req.method === "POST") {
    const {
      body: { name },
    } = req;

    try {
      const newUser = await client.user.create({
        data: {
          username: name,
        },
      });

      res.json({ ok: true, newUser });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}
