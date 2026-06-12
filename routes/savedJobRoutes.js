import express from "express";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob
} from "../controllers/savedJobController.js";

const router = express.Router();

router.post("/", saveJob);

router.get(
  "/check/:studentId/:jobId",
  checkSavedJob
);

router.get(
  "/:studentId",
  getSavedJobs
);

router.delete(
  "/:studentId/:jobId",
  removeSavedJob
);

export default router;