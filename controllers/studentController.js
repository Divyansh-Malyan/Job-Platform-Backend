import pool from "../config/db.js";

export const getStudentProfile = async (req, res) => {
  try {

    const { userId } = req.params;

    const studentResult = await pool.query(
      `
      SELECT *
      FROM "Students"
      WHERE user_student_id = $1
      `,
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const student = studentResult.rows[0];

    const skillsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Skills"
      WHERE student_skill_id = $1
      `,
      [userId]
    );

    const projectsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Projects"
      WHERE student_id = $1
      `,
      [userId]
    );

    const experienceResult = await pool.query(
      `
      SELECT *
      FROM "Student_Experience"
      WHERE student_id = $1
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      student,
      skills: skillsResult.rows,
      projects: projectsResult.rows,
      experience: experienceResult.rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};