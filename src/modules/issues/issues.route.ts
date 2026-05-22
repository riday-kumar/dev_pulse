import { Router } from "express";
import { issuesController } from "./issues.controller.js";
import auth from "../../middleware/auth.js";

const router = Router();

// protected
router.post(
  "/",
  auth("contributor", "maintainer"),
  issuesController.createIssues,
);

router.get("/", issuesController.getAllIssues);

export const issuesRoute = router;
