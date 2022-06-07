import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      query: { id },
      body: { score, review },
      session: { user },
    } = req;
    console.log(score);

    try {
      const registeredReview = await client.review.create({
        data: {
          review,
          createdUser: { connect: { id: user?.id } },
          commentedShop: { connect: { id: +id } },
          score: +score,
        },
      });

      res.json({ ok: true, registeredReview });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}

export default withSession(handler);
