import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.post("/signup", userController.userRegister);

export const userRoute = router;
