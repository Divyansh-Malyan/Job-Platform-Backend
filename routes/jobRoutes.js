import express from "express";
import { createJob, getJobs, getJobById, getRecruiterJobs, updateJobStatus, deleteJob, updateJob, getApplicantsByJob, getRecruiterCompany } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/recruiter/company/:recruiterId", getRecruiterCompany);
router.get("/recruiter/:recruiterId", getRecruiterJobs);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);
router.get("/job/:jobId", getApplicantsByJob);
router.get("/:id", getJobById);


export default router;