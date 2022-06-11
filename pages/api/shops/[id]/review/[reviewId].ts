import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, reviewId },
    session: { user },
  } = req;

  try {
    const deletedReview = await client.review.delete({
      where: { id: +reviewId },
    });

    res.json({ ok: true, deletedReview });
  } catch (error) {
    res.json({ ok: false, error });
  }
}

export default withSession(withHandler({ method: ["DELETE"], fn: handler }));
