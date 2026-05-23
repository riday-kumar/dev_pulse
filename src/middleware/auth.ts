import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types/index.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "unauthorized user",
          data: {},
        });
      }

      // token verification
      const decodeToken = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;

      // console.log("decoded token", decodeToken);
      // if token is wrong it will go to catch

      if (
        decodeToken.role === "contributor" ||
        decodeToken.role === "maintainer"
      ) {
        req.body.reporter_id = decodeToken.id;
        req.body.reporter_role = decodeToken.role;
        next();
      }
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
        data: {},
      });
    }
  };
};

export default auth;
