import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      username: string;
      avatarId?: string;
    };
  }
}

const options: IronSessionOptions = {
  cookieName: "reservation-site",
  password: process.env.COOKIE_PASSWORD!,
};

export function withSession(fn: any) {
  return withIronSessionApiRoute(fn, options);
}
