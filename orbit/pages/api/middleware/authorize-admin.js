import nextConnect from "next-connect";
import authorize from "./authorize";

const middleware = nextConnect();

middleware.use(authorize);

async function authorizeAdmin(req, res, next) {
  if (!req?.user?.role || req?.user?.role !== "admin") {
    return res.status(401).json({ message: "Insufficient Role" });
  }
  return next();
}

middleware.use(authorizeAdmin);

export default middleware;
