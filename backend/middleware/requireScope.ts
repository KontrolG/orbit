import nextConnect from "next-connect";
import requireAuth from "./requireAuth";
import checkSessionScope, {
  AuthzOptions,
  AuthzScopes
} from "express-jwt-authz";
import { NextApiRequestWithSession } from "./attachUserSub";

const requireScope = (
  expectedScopes: AuthzScopes,
  options?: Omit<
    AuthzOptions,
    "customUserKey" | "customScopeKey" | "failWithError"
  >
) =>
  nextConnect()
    .use(requireAuth)
    .use(
      checkSessionScope(expectedScopes, {
        ...options,
        customUserKey: "session",
        customScopeKey: "accessTokenScope",
        failWithError: true // Required to prevent "res.append is not a function" error.
      })
    );

export type { NextApiRequestWithSession };

export default requireScope;
