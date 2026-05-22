import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({
  path: path.join(cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STRING,
  secret: process.env.SECRET,
};

export default config;
