import express from "express";

import {
  updateCompany
}
from "../controllers/companyController.js";

const router =
  express.Router();

router.put(
  "/:compId",
  updateCompany
);

export default router;