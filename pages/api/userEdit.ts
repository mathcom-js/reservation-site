import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      body: { username, id },
    } = req;
    try {
      const block =
        id.length > 0
          ? {
              username,
              avatarId: id,
            }
          : { username };

      const updatedUser = await client.user.update({
        where: {
          id: 5,
        },
        data: block,
      });

      res.json({ ok: true, updatedUser });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}
