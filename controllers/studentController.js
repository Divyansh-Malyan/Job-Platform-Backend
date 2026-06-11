import pool from "../config/db.js";

export const getStudentById = async (req, res) => {
  try {

    const { studentId } = req.params;

    console.log("Student ID:", studentId);

    const studentResult = await pool.query(
      `
      SELECT *
      FROM "Students"
      WHERE id = $1
      `,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const student = studentResult.rows[0];

    console.log("Student Row:", student);

    const skillsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Skills"
      WHERE student_skill_id = $1
      `,
      [student.user_student_id]
    );

    console.log("Skills fetched");

    const projectsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Projects"
      WHERE student_id = $1
      `,
      [student.user_student_id]
    );

    console.log("Projects fetched");

    const experienceResult = await pool.query(
      `
      SELECT *
      FROM "Student_Experience"
      WHERE student_id = $1
      `,
      [student.user_student_id]
    );

    console.log("Experience fetched");

    const emailResult = await pool.query(
      `
      SELECT email
      FROM "User"
      WHERE user_id = $1
      `,
      [student.user_student_id]
    );

    console.log("Email fetched");

    return res.status(200).json({
      success: true,
      student,
      email: emailResult.rows[0]?.email || "",
      skills: skillsResult.rows,
      projects: projectsResult.rows,
      experience: experienceResult.rows
    });

  } catch (error) {

    console.error("GET STUDENT ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

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

    return res.status(200).json({
      success: true,
      student,
      skills: skillsResult.rows,
      projects: projectsResult.rows,
      experience: experienceResult.rows
    });

  } catch (error) {

    console.error("GET PROFILE ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};