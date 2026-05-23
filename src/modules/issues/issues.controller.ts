import type { Request, Response } from "express";
import { issuesService } from "./issues.service.js";
import type { TUser } from "../../types/index.js";

const createIssues = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { id: reporter_id } = req.user as TUser;

  try {
    const result = await issuesService.createIssuesIntoDB(
      req.body,
      reporter_id,
    );

    res.status(201).json({
      success: true,
      message: "Issue Created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesFromDB(req.query);

    res.status(200).json({
      success: true,
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

const getSingleIssue = async (req: Request, res: Response) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const result = await issuesService.getSingleIssueFromDB(id as string);

    // console.log("from controller", result);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message == "No Issue Found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message,
        errors: error,
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

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.message == "Forbidden") {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message,
        errors: error,
      });
    }
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await issuesService.deleteIssueFromDB(id as string);
    if (result.rowCount !== 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
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
