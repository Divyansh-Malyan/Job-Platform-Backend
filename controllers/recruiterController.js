import pool from "../config/db.js";

export const updateRecruiter = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      name,
      designation,
      linkedin,
      profile_photo
    } = req.body;

    const result =
      await pool.query(
        `
        UPDATE "Recruiters"
        SET
          name = $1,
          designation = $2,
          linkedin = $3,
          profile_photo = $4
        WHERE id = $5
        RETURNING *
        `,
        [
          name,
          designation,
          linkedin,
          profile_photo,
          id
        ]
      );

    res.json({
      success: true,
      recruiter: result.rows[0]
    });

  } catch (error) {

    console.error(
      "UPDATE RECRUITER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getRecruiterProfile = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    const recruiter =
      await pool.query(
        `
        SELECT *
        FROM "Recruiters"
        WHERE id = $1
        `,
        [id]
      );


    if (
      recruiter.rows.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message: "Recruiter not found"
      });

    }

    const companyId =
      recruiter.rows[0].company_id;


    const company =
      await pool.query(
        `
        SELECT *
        FROM "Company"
        WHERE comp_id = $1
        `,
        [companyId]
      );


    res.json({
      success: true,
      recruiter:
        recruiter.rows[0],
      company:
        company.rows[0] || null
    });

  } catch (error) {

    console.error(
      "GET RECRUITER PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};