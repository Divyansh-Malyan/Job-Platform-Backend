import express from "express";

import {
  updateRecruiter,
  getRecruiterProfile
}
from "../controllers/recruiterController.js";

const router =
  express.Router();

router.get(
  "/:id",
  getRecruiterProfile
);

router.put(
  "/:id",
  updateRecruiter
);

export default router;