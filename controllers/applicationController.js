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

  export const updateApplicationStatus = async (req, res) => {
    try {
  
      const { applicationId } = req.params;
      const { status } = req.body;
  
      const applicationResult = await pool.query(
        `
        SELECT *
        FROM "Applications"
        WHERE id = $1
        `,
        [applicationId]
      );
  
      if (applicationResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }
  
      const application = applicationResult.rows[0];
  
      // Prevent changing final decisions
  
      if (
        application.status === "Accepted" ||
        application.status === "Rejected"
      ) {
        return res.status(400).json({
          success: false,
          message: `Application already ${application.status}`
        });
      }
  
      await pool.query(
        `
        UPDATE "Applications"
        SET status = $1
        WHERE id = $2
        `,
        [status, applicationId]
      );
  
      // Fetch Job + Company Details
  
      const jobResult = await pool.query(
        `
        SELECT
          jp.role,
          c.company_name
        FROM "Job_Posting" jp
        JOIN "Company" c
          ON jp.comp_id = c.comp_id
        WHERE jp.id = $1
        `,
        [application.job_id]
      );
  
      const role =
        jobResult.rows[0]?.role || "the position";
  
      const companyName =
        jobResult.rows[0]?.company_name || "the company";
  
      // Create Notification
  
      let title = "";
      let message = "";
  
      if (status === "Accepted") {
  
        title = "Application Accepted";
  
        message =
          `Congratulations! ${companyName} accepted your application for ${role}.`;
  
      }
  
      if (status === "Rejected") {
  
        title = "Application Rejected";
  
        message =
          `${companyName} did not move forward with your application for ${role}.`;
  
      }
  
      if (status === "Shortlisted") {
  
        title = "Application Shortlisted";
  
        message =
          `${companyName} shortlisted you for ${role}.`;
  
      }
  
      if (title) {
  
        await pool.query(
          `
          INSERT INTO "Notifications"
          (
            user_id,
            title,
            message
          )
          VALUES ($1,$2,$3)
          `,
          [
            application.student_id,
            title,
            message
          ]
        );
  
      }
  
      res.status(200).json({
        success: true,
        message: "Application status updated"
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: error.message
      });
  
    }
  };