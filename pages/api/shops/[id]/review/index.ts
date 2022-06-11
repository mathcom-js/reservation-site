import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { score, review },
    session: { user },
  } = req;

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

export default withSession(withHandler({ method: ["POST"], fn: handler }));
