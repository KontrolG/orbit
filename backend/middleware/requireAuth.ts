import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import attachUserSub, {
  NextApiRequestWithSession as _NextApiRequestWithSession
} from "./attachUserSub";

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

const requireAuth = nextConnect()
  .use((req: NextApiRequest, res: NextApiResponse<any>, next) =>
    withApiAuthRequired(() => next())(req, res)
  )
  .use((req: NextApiRequestWithSession, res: NextApiResponse<any>, next) => {
    req.session = getSession(req, res);
    next();
  })
  .use(attachUserSub);

export type { _NextApiRequestWithSession as NextApiRequestWithSession };

export default requireAuth;
