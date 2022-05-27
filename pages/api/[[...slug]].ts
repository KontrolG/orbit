import requireScope from "api/middleware/requireScope";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import * as dashboardData from "./data/dashboard";
import prisma from "api/prisma";

const app = nextConnect();
const router = nextConnect();

router.get(
  "/dashboard-data",
  nextConnect()
    .use(requireScope(["read:dashboard"]))
    .use<NextApiRequest, NextApiResponse>(async (req, res) => {
      return res.json(dashboardData);
    }) as any
);

// TODO: Pedir el token de Auth0 y validarlo.
router.post<NextApiRequest, NextApiResponse>(
  "/orbit-id-for-user",
  async (req, res) => {
    try {
      const { email, firstName, lastName, userId } = req.body;
      const user = await prisma.user.findUnique({ where: { userId } });

      if (user) {
        return res.json({ orbit_id: user.id });
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          userId
        }
      });

      res.json({ orbit_id: newUser.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

app.use("/api", router);

export default app;
