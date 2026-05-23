import type { Request, Response } from "express";
import { userService } from "./user.service.js";
import sendResponse from "../../utility/sendResponse.js";

const userRegister = async (req: Request, res: Response) => {
  try {
    const result = await userService.userRegisterIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const result = await userService.userLoginIntoDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  userRegister,
  userLogin,
};
