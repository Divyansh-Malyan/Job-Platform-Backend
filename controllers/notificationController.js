// controllers/notificationController.js

import pool from "../config/db.js";

export const getNotifications = async (req, res) => {
    try {

        const { userId } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM "Notifications"
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.status(200).json({
            success: true,
            notifications: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const markAllRead = async (req, res) => {
    try {

        const { userId } = req.params;

        await pool.query(
            `
            UPDATE "Notifications"
            SET is_read = true
            WHERE user_id = $1
            `,
            [userId]
        );

        res.status(200).json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};