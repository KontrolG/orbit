import managementClient from "backend/auth0/managementClient";
import prisma from "backend/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get<NextApiRequest, NextApiResponse>(async (req, res) => {
  try {
    const id = req.query?.id?.toString?.();
    const user = await prisma.user.findUnique({ where: { id } });
    const data = await managementClient.getUserRoles({
      id: user.userId,
      page: 0,
      per_page: 100,
      include_totals: true
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

handler.post<NextApiRequest, NextApiResponse>(async (req, res) => {
  try {
    const id = req.query?.id?.toString?.();
    const user = await prisma.user.findUnique({ where: { id } });
    const roles = req.body.roles;
    await managementClient.assignRolestoUser({ id: user.userId }, { roles });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

export default handler;
