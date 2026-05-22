import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.post("/signup", userController.userRegister);
router.post("/login", userController.userLogin);

export const userRoute = router;
