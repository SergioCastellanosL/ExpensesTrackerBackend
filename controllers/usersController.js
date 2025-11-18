import pool from "../models/db.js";
import bcrypt from "bcrypt";

//Get Users
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }    
}

//POST User sign up
export const createUser = async (req,res) => {
	const {username, password} = req.body;
	try{
		const check = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
		if (check.rows.length > 0) {
			return res.status(409).json({ message: "Username already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await pool.query(
			"INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
			[username, hashedPassword]
		);
		res.status(201).json(result.rows[0]);
	}catch(err){
		console.error(err);
		res.status(500).send("Database error");
	}
}

//PUT Edit User
export const updateUser = async (req,res) => {
	const { id } = req.params;
  	const { username, password } = req.body;
	try {
		const check = await pool.query(
		"SELECT * FROM users WHERE username = $1 AND id != $2",
		[username, id]
		);
		if (check.rows.length > 0) {
			return res.status(409).json({ message: "Username already exists" });
		}

		const result = await pool.query(
		"UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *",
		[username, password, id]
		);

		if (result.rows.length === 0) {
		return res.status(404).json({ message: "User not found" });
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Database error");
	}
}

//DELETE User
export const deleteUser = async (req,res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
		"DELETE FROM users WHERE id = $1 RETURNING *",
		[id]
		);

		if (result.rows.length === 0) {
		return res.status(404).json({ message: "User not found" });
		}

		res.json({ message: "User deleted successfully", user: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).send("Database error");
	}
}

//Search users
export const searchUsers = async (req, res) => {
  const { search } = req.query;
  try {
    if (!search) {
      return res.json([]);
    }

    const result = await pool.query(
      "SELECT id, username FROM users WHERE LOWER(username) LIKE LOWER($1)",
      [`%${search}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
};