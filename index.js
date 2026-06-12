import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";





const app = express();

app.use(cors());
app.use(express.json());

app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/students", studentRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notifications", notificationRoutes);
app.use("/saved-jobs", savedJobRoutes);
app.use("/recruiters", recruiterRoutes);
app.use("/companies", companyRoutes);





app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database Connection Failed");
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});