import express from "express";
import { applyJob, checkApplication,  updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", applyJob);
router.get(
    "/check/:jobId/:studentId",
    checkApplication
  );
  router.patch(
    "/:applicationId/status",
    updateApplicationStatus
  );

export default router;