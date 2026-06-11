import express from "express";
import {
    getStudentProfile,
    getStudentById
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile/:userId", getStudentProfile);
router.get("/:studentId", getStudentById);

export default router;