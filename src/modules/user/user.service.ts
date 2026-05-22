import { pool } from "../../db/index.js";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

const userRegisterIntoDB = async (payLoad: IUser) => {
  const { name, email, password, role } = payLoad;

  // hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  const result = pool.query(
    `
          INSERT INTO users (name, email, password, role)
          VALUES($1, $2, $3, $4)
          RETURNING id, name,email,role,created_at,updated_at
      `,
    [name, email, hashPassword, role || "contributor"],
  );

  return result;
};

export const userService = {
  userRegisterIntoDB,
};
