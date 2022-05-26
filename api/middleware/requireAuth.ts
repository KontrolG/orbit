import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

const requireAuth = nextConnect()
  .use(async (req: NextApiRequest, res: NextApiResponse<any>, next) => {
    await withApiAuthRequired(() => next())(req, res);
  })
  .use((req: NextApiRequestWithSession, res: NextApiResponse<any>, next) => {
    req.session = getSession(req, res);
    next();
  });

export default requireAuth;
