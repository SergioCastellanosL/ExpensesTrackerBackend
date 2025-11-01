import pool from "../models/db.js";

export const createAccount = async (req, res) => {
    const { name, type, balance, sharedWith } = req.body;
    const creatorId = req.user.id;
    try {
        const accountResult = await pool.query(
            "INSERT INTO accounts (name, type, balance) VALUES ($1, $2, $3) RETURNING *",
            [name, type, balance || 0]
        );
        const account = accountResult.rows[0];
        const allUserIds = [creatorId, ...(sharedWith || [])];
        const insertPromises = allUserIds.map(userId => {
            return pool.query(
                "INSERT INTO users_accounts (user_id, account_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [userId, account.id]
            );
        });

        await Promise.all(insertPromises);
        res.status(201).json(account);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};