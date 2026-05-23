import type { JwtPayload } from "jsonwebtoken";
import type { TUser } from "../types/index.ts";

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}
