import express from "express";
import {
    getStudentProfile,
    getStudentById, updateStudentProfile
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile/:userId", getStudentProfile);
router.get("/:studentId", getStudentById);
router.put("/profile/:userId",updateStudentProfile);

export default router;