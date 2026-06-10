import pool from "../config/db.js";

export const applyJob = async (req, res) => {
  try {

    const {
      job_id,
      student_id
    } = req.body;

    // Check if already applied

    const existingApplication = await pool.query(
      `
      SELECT *
      FROM "Applications"
      WHERE job_id = $1
      AND student_id = $2
      `,
      [job_id, student_id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Create application

    const result = await pool.query(
      `
      INSERT INTO "Applications"
      (
        job_id,
        student_id,
        status
      )
      VALUES
      ($1,$2,$3)
      RETURNING *
      `,
      [
        job_id,
        student_id,
        "pending"
      ]
    );

    res.status(201).json({
      success: true,
      application: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const checkApplication = async (req, res) => {

    try {
  
      const { jobId, studentId } = req.params;
  
      const result = await pool.query(
        `
        SELECT *
        FROM "Applications"
        WHERE job_id = $1
        AND student_id = $2
        `,
        [jobId, studentId]
      );
  
      res.status(200).json({
        success: true,
        applied: result.rows.length > 0
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message
      });
  
    }
  };