import prisma from "backend/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database from "../../../backend/middleware/database";

const handler = nextConnect();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async (req, res) => {
  try {
    const data = await prisma.user.findMany();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

export default handler;
