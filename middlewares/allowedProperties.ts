import { NextFunction, Request, Response } from "express";

export const validateProperties = (allowedProperties: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const key in req.body) {
      if (!allowedProperties.includes(key)) {
        res.status(400).json({ message: `Property ${key} is not allowed` });
        return;
      }
    }
    next();
  };
};
