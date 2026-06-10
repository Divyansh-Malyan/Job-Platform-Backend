import express from "express";
import { createJob, getJobs, getJobById, getRecruiterJobs, updateJobStatus, deleteJob, updateJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/recruiter/:recruiterId",getRecruiterJobs);
router.get("/:id", getJobById);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);

export default router;