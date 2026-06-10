import express from "express";
import {
  getRecruiterDashboard
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/:recruiterId",
  getRecruiterDashboard
);

export default router;