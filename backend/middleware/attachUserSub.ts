import { namespace } from "backend/constants/keys";
import nextConnect from "next-connect";
import jwt from "jsonwebtoken";
import { Session } from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";

type User = Session["user"];

interface UserWithSub extends User {
  sub?: string;
}

interface SessionWithUserSub extends Session {
  user: UserWithSub;
}

export interface NextApiRequestWithSession extends NextApiRequest {
  session: SessionWithUserSub;
}

const attachUserSub = nextConnect().use(
  (req: NextApiRequestWithSession, res, next) => {
    if (!req.session || !req.session.accessToken) return next();
    req.session.user.sub = jwt.decode(req.session.accessToken)?.[
      `${namespace}/sub`
    ];
    next();
  }
);

export default attachUserSub;
