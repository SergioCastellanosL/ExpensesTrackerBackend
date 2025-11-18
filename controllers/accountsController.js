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

//Get Accounts
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT a.*
       FROM accounts a
       JOIN users_accounts ua ON ua.account_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }    
}

export const editAccount = async (req, res) => {
  const { accountId } = req.params;
  const { name, type, balance, sharedWith } = req.body;
  const userId = req.user.id;
  try {
    const accessCheck = await pool.query(
      "SELECT * FROM users_accounts WHERE account_id = $1 AND user_id = $2",
      [accountId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: "You don't have access to this account" });
    }

    // Update account
    const updateResult = await pool.query(
      "UPDATE accounts SET name = $1, type = $2, balance = $3 WHERE id = $4 RETURNING *",
      [name, type, balance, accountId]
    );

    // Update shared users
    if (sharedWith) {
      await pool.query(
        "DELETE FROM users_accounts WHERE account_id = $1 AND user_id != $2",
        [accountId, userId]
      );

      const insertPromises = sharedWith.map(uid => 
        pool.query(
          "INSERT INTO users_accounts (user_id, account_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [uid, accountId]
        )
      );
      await Promise.all(insertPromises);
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const deleteAccount = async (req, res) => {
  const { accountId } = req.params;
  const userId = req.user.id;

  try {
    const accessCheck = await pool.query(
      "SELECT * FROM users_accounts WHERE account_id = $1 AND user_id = $2",
      [accountId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: "You don't have access to this account" });
    }
    
    // Delete from users_accounts
    await pool.query(
      "DELETE FROM users_accounts WHERE account_id = $1",
      [accountId]
    );

    // Delete account
    await pool.query(
      "DELETE FROM accounts WHERE id = $1",
      [accountId]
    );

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};