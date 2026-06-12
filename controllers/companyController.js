import pool from "../config/db.js";

export const updateCompany = async (
  req,
  res
) => {

  try {

    const { compId } =
      req.params;

    const {
      company_name,
      industry,
      location,
      website,
      logo_url,
      description
    } = req.body;


    const result =
      await pool.query(
        `
        UPDATE "Company"
        SET
          company_name = $1,
          industry = $2,
          location = $3,
          website = $4,
          logo_url = $5,
          description = $6
        WHERE comp_id = $7
        RETURNING *
        `,
        [
          company_name,
          industry,
          location,
          website,
          logo_url,
          description,
          compId
        ]
      );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Company not found"
      });

    }

    res.json({
      success: true,
      company: result.rows[0]
    });

  } catch (error) {

    console.error(
      "UPDATE COMPANY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};