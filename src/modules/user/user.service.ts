import { pool } from "../../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

interface ISignin {
  email: string;
  password: string;
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

const userLoginIntoDB = async (payLoad: ISignin) => {
  const { email, password } = payLoad;

  // check user has or not
  const userData = await pool.query(
    `
            SELECT * FROM users
            WHERE email = $1
        `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }

  const userInfo = userData.rows[0];

  // check user password is right or not
  const matchPassword = await bcrypt.compare(password, userInfo.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // generate token
  const jwtPayLoad = {
    id: userInfo.id,
    name: userInfo.name,
    role: userInfo.role,
  };

  const token = jwt.sign(jwtPayLoad, config.secret as string, {
    expiresIn: "2h",
  });

  const { password: newPass, ...user } = userInfo;

  return { token, user };
};

export const userService = {
  userRegisterIntoDB,
  userLoginIntoDB,
};
