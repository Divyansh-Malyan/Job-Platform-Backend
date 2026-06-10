import express from "express";
import { applyJob, checkApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", applyJob);
router.get(
    "/check/:jobId/:studentId",
    checkApplication
  );

export default router;