import pool from "../config/db.js";

export const createJob = async (req, res) => {
  try {
    const {
      recruiterId,
      role,
      description_job,
      location_job,
      exp_required,
      salary,
      deadline,
      job_type,
      skills_required,
      work_mode,
      openings,
      status,
    } = req.body;

    // Get recruiter's company
    const recruiterResult = await pool.query(
      `
      SELECT company_id
      FROM "Recruiters"
      WHERE id = $1
      `,
      [recruiterId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    const comp_id = recruiterResult.rows[0].company_id;

    // Create job
    const result = await pool.query(
      `
      INSERT INTO "Job_Posting"
      (
        role,
        description_job,
        location_job,
        exp_required,
        salary,
        deadline,
        job_type,
        skills_required,
        work_mode,
        openings,
        status,
        comp_id
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        role,
        description_job,
        location_job,
        exp_required,
        salary,
        deadline,
        job_type,
        skills_required,
        work_mode,
        openings,
        status,
        comp_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        jp.*,
        c.company_name,
        c.website
      FROM "Job_Posting" jp
      JOIN "Company" c
      ON jp.comp_id = c.comp_id
      ORDER BY jp.created_at DESC
    `);

    res.status(200).json({
      success: true,
      jobs: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        jp.*,
        c.company_name,
        c.website
      FROM "Job_Posting" jp
      JOIN "Company" c
      ON jp.comp_id = c.comp_id
      WHERE jp.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    // Find recruiter's company
    const recruiterResult = await pool.query(
      `
      SELECT company_id
      FROM "Recruiters"
      WHERE id = $1
      `,
      [recruiterId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    const companyId =
      recruiterResult.rows[0].company_id;

    // Get only this company's jobs
    const jobsResult = await pool.query(
      `
      SELECT
        jp.*,
        c.company_name,
        c.website
      FROM "Job_Posting" jp
      JOIN "Company" c
      ON jp.comp_id = c.comp_id
      WHERE jp.comp_id = $1
      ORDER BY jp.created_at DESC
      `,
      [companyId]
    );

    res.status(200).json({
      success: true,
      jobs: jobsResult.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE "Job_Posting"
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job: result.rows[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const deleteJob = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM "Job_Posting"
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      role,
      description_job,
      location_job,
      exp_required,
      salary,
      deadline,
      job_type,
      skills_required,
      work_mode,
      openings,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE "Job_Posting"
      SET
        role = $1,
        description_job = $2,
        location_job = $3,
        exp_required = $4,
        salary = $5,
        deadline = $6,
        job_type = $7,
        skills_required = $8,
        work_mode = $9,
        openings = $10
      WHERE id = $11
      RETURNING *
      `,
      [
        role,
        description_job,
        location_job,
        exp_required,
        salary,
        deadline,
        job_type,
        skills_required,
        work_mode,
        openings,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      job: result.rows[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};