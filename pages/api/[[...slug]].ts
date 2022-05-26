import requireScope from "api/middleware/requireScope";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import * as dashboardData from "./data/dashboard";

const app = nextConnect();
const router = nextConnect();

router.get(
  "/dashboard-data",
  nextConnect()
    .use(requireScope(["read:dashboard"]))
    .use<NextApiRequest, NextApiResponse>((req, res) =>
      res.json(dashboardData)
    ) as any
);

app.use("/api", router);

export default app;
