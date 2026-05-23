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
router.get("/:id", issuesController.getSingleIssue);

//protected
router.patch(
  "/:id",
  auth("contributor", "maintainer"),
  issuesController.updateIssue,
);

//protected
router.delete("/:id", auth("maintainer"), issuesController.deleteIssue);

export const issuesRoute = router;
