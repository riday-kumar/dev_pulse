import type { Request, Response } from "express";
import { issuesService } from "./issues.service.js";
import type { TUser } from "../../types/index.js";
import sendResponse from "../../utility/sendResponse.js";

const createIssues = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { id: reporter_id } = req.user as TUser;

  try {
    const result = await issuesService.createIssuesIntoDB(
      req.body,
      reporter_id,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue Created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
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

const getSingleIssue = async (req: Request, res: Response) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const result = await issuesService.getSingleIssueFromDB(id as string);

    // console.log("from controller", result);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message == "No Issue Found") {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: error.message,
      });
    } else {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message,
        error: error,
      });
    }
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { id: reporter_id, role: reporter_role } = req.user as TUser;
  try {
    const result = await issuesService.updateIssueFromDB(
      id as string,
      req.body,
      reporter_id,
      reporter_role,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.message == "Forbidden") {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: error.message,
      });
    } else {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message,
      });
    }
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await issuesService.deleteIssueFromDB(id as string);
    if (result.rowCount !== 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
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

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
