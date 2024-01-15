import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

export const authMiddleware = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).json({ error: "Invalid token" });
  }

  try {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: any, user: any) => {
        if (err) {
          res.sendStatus(401).json({ error: "Invalid token" });
          return;
        }

        //@ts-ignore
        req.user = user;

        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(401).json({ error: "Invalid token" });
  }
};
