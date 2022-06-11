import { NextApiRequest, NextApiResponse } from "next";

interface withHandlerInputs {
  method: ("GET" | "POST" | "PUT" | "DELETE")[];
  isSession?: boolean;
  fn: any;
}

export function withHandler({
  method,
  fn,
  isSession = true,
}: withHandlerInputs) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !method.includes(req.method as any)) {
      return res.status(405).json({ ok: false, error: "Method not match" });
    } else if (isSession && !req.session.user) {
      return res.status(401).json({ ok: false, error: "No session user" });
    } else {
      try {
        await fn(req, res);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, error });
      }
    }
  };
}
