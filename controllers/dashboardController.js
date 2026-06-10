import pool from "../config/db.js";

export const getRecruiterDashboard = async (req, res) => {
  try {

    const { recruiterId } = req.params;

    // Get Recruiter

    const recruiterResult = await pool.query(
      `
      SELECT *
      FROM "Recruiters"
      WHERE id = $1
      `,
      [recruiterId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found"
      });
    }

    const companyId =
      recruiterResult.rows[0].company_id;

    // Get Jobs

    const jobsResult = await pool.query(
      `
      SELECT *
      FROM "Job_Posting"
      WHERE comp_id = $1
      ORDER BY created_at DESC
      `,
      [companyId]
    );

    const jobs = jobsResult.rows;

    const jobIds = jobs.map(
      (job) => job.id
    );

    let applications = [];

    let pipeline = {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0
    };

    // Get Applications

    if (jobIds.length > 0) {

      const applicationsResult =
        await pool.query(
          `
          SELECT
            a.*,
            s.name AS student_name,
            j.role AS job_role

          FROM "Applications" a

          JOIN "Students" s
            ON a.student_id = s.user_student_id

          JOIN "Job_Posting" j
            ON a.job_id = j.id

          WHERE a.job_id = ANY($1::uuid[])

          ORDER BY a.created_at DESC
          `,
          [jobIds]
        );

      applications =
        applicationsResult.rows;

      pipeline = {

        pending: applications.filter(
          (app) =>
            app.status === "Pending"
        ).length,

        reviewed: applications.filter(
          (app) =>
            app.status === "Reviewed"
        ).length,

        accepted: applications.filter(
          (app) =>
            app.status === "Accepted"
        ).length,

        rejected: applications.filter(
          (app) =>
            app.status === "Rejected"
        ).length

      };

    }

    const recentApplications =
      applications.slice(0, 5);

    const stats = {

      jobsPosted: jobs.length,

      activeJobs: jobs.filter(
        (job) =>
          job.status === "Active"
      ).length,

      closedJobs: jobs.filter(
        (job) =>
          job.status === "Closed"
      ).length,

      applicants:
        applications.length

    };

    res.status(200).json({
      success: true,
      stats,
      pipeline,
      jobs,
      applications,
      recentApplications
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};