import { ManagementClient } from "auth0";

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace?.("https://", ""),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users read:roles"
});

export default managementClient;
