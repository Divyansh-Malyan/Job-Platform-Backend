import pool from "../config/db.js";

export const getStudentById = async (req, res) => {
  try {

    const { studentId } = req.params;


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


    const skillsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Skills"
      WHERE student_skill_id = $1
      `,
      [student.user_student_id]
    );


    const projectsResult = await pool.query(
      `
      SELECT *
      FROM "Student_Projects"
      WHERE student_id = $1
      `,
      [student.user_student_id]
    );


    const experienceResult = await pool.query(
      `
      SELECT *
      FROM "Student_Experience"
      WHERE student_id = $1
      `,
      [student.user_student_id]
    );


    const emailResult = await pool.query(
      `
      SELECT email
      FROM "User"
      WHERE user_id = $1
      `,
      [student.user_student_id]
    );


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

export const updateStudentProfile = async (
  req,
  res
) => {

  try {

    const { userId } = req.params;

    const data = req.body;

    // ---------------- STUDENT INFO ----------------

    await pool.query(
      `
  UPDATE "Students"
  SET
    name = $1,
    headline = $2,
    phone = $3,
    city = $4,
    country = $5,
    course = $6,
    college = $7,
    cgpa = $8,
    about = $9,
    github = $10,
    linkedin = $11,
    portfolio = $12,
    leetcode = $13,
    open_to_work = $14,
    preferred_job_type = $15,
    preferred_location = $16,
    work_mode = $17,
    profile_photo = COALESCE($18, profile_photo),
    resume_url = COALESCE($19, resume_url)
  WHERE user_student_id = $20
  `,
      [
        data.name,
        data.headline,
        data.phone,
        data.city,
        data.country,
        data.course,
        data.college,
        data.cgpa,
        data.bio,
        data.github,
        data.linkedin,
        data.portfolio,
        data.leetcode,
        data.openToWork === "true",
        data.preferredJobType,
        data.preferredLocation,
        data.workMode,
        data.profilePhotoUrl,
        data.resumeUrl,
        userId
      ]
    );

    const updatedStudent = await pool.query(
      `
  SELECT
    profile_photo,
    resume_url
  FROM "Students"
  WHERE user_student_id = $1
  `,
      [userId]
    );

    // ---------------- SKILLS ----------------
    await pool.query(
      `
      DELETE FROM "Student_Skills"
      WHERE student_skill_id = $1
      `,
      [userId]
    );

    const skillsArray = data.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    if (skillsArray?.length > 0) {

      for (const skill of skillsArray) {

        await pool.query(
          `
          INSERT INTO "Student_Skills"
          (
            student_skill_id,
            name
          )
          VALUES ($1, $2)
          `,
          [
            userId,
            skill
          ]
        );

      }

    }

    // ---------------- PROJECTS ----------------

    await pool.query(
      `
  DELETE FROM "Student_Projects"
  WHERE student_id = $1
  `,
      [userId]
    );

    if (data.projects?.length > 0) {

      for (const project of data.projects) {

        if (!project.name?.trim()) continue;

        await pool.query(
          `
      INSERT INTO "Student_Projects"
      (
        project_name,
        tech_stack,
        github_link,
        demo_link,
        description,
        student_id
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      `,
          [
            project.name,
            project.techStack,
            project.github,
            project.demo,
            project.description,
            userId
          ]
        );

      }

    }

    // ---------------- EXPERIENCE ----------------

    await pool.query(
      `
  DELETE FROM "Student_Experience"
  WHERE student_id = $1
  `,
      [userId]
    );

    if (data.experiences?.length > 0) {

      for (const exp of data.experiences) {

        if (!exp.company?.trim()) continue;

        await pool.query(
          `
      INSERT INTO "Student_Experience"
      (
        company_name,
        role,
        duration,
        about,
        student_id
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      `,
          [
            exp.company,
            exp.role,
            exp.duration,
            exp.description,
            userId
          ]
        );

      }

    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }


};