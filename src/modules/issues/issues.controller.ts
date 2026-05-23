import type { Request, Response } from "express";
import { issuesService } from "./issues.service.js";

const createIssues = async (req: Request, res: Response) => {
  //   console.log(req.body);
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);

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

    console.log("from controller", result);

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

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
};
