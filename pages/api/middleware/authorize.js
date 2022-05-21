import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import nextConnect from "next-connect";

async function authorize(req, res, next) {
  try {
    const cookies = parse(req?.headers?.cookie) || {};
    const token = cookies?.token;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
}

const middleware = nextConnect();

middleware.use(authorize);

export default middleware;
