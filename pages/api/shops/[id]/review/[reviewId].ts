import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
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
}

export default withSession(handler);
