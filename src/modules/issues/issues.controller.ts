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

export const issuesController = {
  createIssues,
};
