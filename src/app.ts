import express, {
  json,
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route.js";
const app: Application = express();

// middleware
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", userRoute);

export default app;
