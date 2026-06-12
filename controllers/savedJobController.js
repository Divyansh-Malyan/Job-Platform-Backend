import pool from "../config/db.js";

export const saveJob = async (req, res) => {
  try {

    const {
      student_id,
      job_id
    } = req.body;

    const existing = await pool.query(
      `
      SELECT *
      FROM "Saved_Jobs"
      WHERE student_id = $1
      AND job_id = $2
      `,
      [student_id, job_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Job already saved"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO "Saved_Jobs"
      (
        student_id,
        job_id
      )
      VALUES
      ($1,$2)
      RETURNING *
      `,
      [student_id, job_id]
    );

    res.status(201).json({
      success: true,
      savedJob: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getSavedJobs = async (req, res) => {
  try {

    const { studentId } = req.params;

    const result = await pool.query(
      `
      SELECT
  sj.id AS saved_id,
  sj.created_at AS saved_at,
  jp.*,
  c.company_name
FROM "Saved_Jobs" sj

JOIN "Job_Posting" jp
  ON sj.job_id = jp.id

LEFT JOIN "Company" c
  ON jp.comp_id = c.comp_id

WHERE sj.student_id = $1

ORDER BY sj.created_at DESC
      `,
      [studentId]
    );

    res.status(200).json({
      success: true,
      jobs: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const removeSavedJob = async (req, res) => {
  try {

    const {
      studentId,
      jobId
    } = req.params;

    await pool.query(
      `
      DELETE FROM "Saved_Jobs"
      WHERE student_id = $1
      AND job_id = $2
      `,
      [studentId, jobId]
    );

    res.status(200).json({
      success: true,
      message: "Saved job removed"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const checkSavedJob = async (req, res) => {
  try {

    const {
      studentId,
      jobId
    } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM "Saved_Jobs"
      WHERE student_id = $1
      AND job_id = $2
      `,
      [studentId, jobId]
    );

    res.status(200).json({
      success: true,
      saved: result.rows.length > 0
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};