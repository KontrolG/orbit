import managementClient from "backend/auth0/managementClient";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get<NextApiRequest, NextApiResponse>(async (req, res) => {
  try {
    const data = await managementClient.getRoles({
      page: 0,
      per_page: 50,
      include_totals: true
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

export default handler;
