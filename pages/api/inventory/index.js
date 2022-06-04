import nextConnect from "next-connect";
import prisma from "backend/prisma";
import requireScope from "backend/middleware/requireScope";

const handler = nextConnect();

handler.get(
  nextConnect()
    .use(requireScope(["read:inventory"]))
    .use(async (req, res) => {
      try {
        const { sub } = req.session.user;
        const data = await prisma.inventoryItem.findMany({
          where: { user: sub }
        });
        res.json(data);
      } catch (err) {
        console.log("the err", err);
        res.status(400).json({ message: "Something went wrong" });
      }
    })
);

handler.post(
  nextConnect()
    .use(requireScope(["write:inventory"]))
    .use(async (req, res) => {
      try {
        const { sub } = req.session.user;
        const data = Object.assign({}, req.body, {
          user: sub,
          image:
            "https://images.unsplash.com/photo-1580169980114-ccd0babfa840?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9"
        });

        const insertedInventoryItem = await prisma.inventoryItem.create({
          data
        });

        res.status(201).json({
          message: "Inventory item created!",
          inventoryItem: insertedInventoryItem
        });
      } catch (err) {
        return res.status(400).json({
          message: "There was a problem creating the item"
        });
      }
    })
);

export default handler;
