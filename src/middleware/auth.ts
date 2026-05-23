import type { NextFunction, Request, Response } from "express";
import type { ROLES, TUser } from "../types/index.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";

const auth = (...roles: ROLES[]) => {
  type IMiddleUser = {
    id: number;
    name: string;
    role: string;
  };
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

      console.log(decodeToken);
      console.log(roles);

      // console.log("decoded token", decodeToken);
      // if token is wrong it will go to catch

      if (roles.includes(decodeToken.role)) {
        // req.body.reporter_id = decodeToken.id;
        // req.body.reporter_role = decodeToken.role;
        req.user = decodeToken as TUser;
        return next();
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
