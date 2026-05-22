import type { Request, Response } from "express";
import { userService } from "./user.service.js";

const userRegister = async (req: Request, res: Response) => {
  try {
    const result = await userService.userRegisterIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const result = await userService.userLoginIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const userController = {
  userRegister,
  userLogin,
};
