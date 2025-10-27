import pool from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY;

export const login = async (req,res) => {
	const {username, password} = req.body;
	try {
		const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
		if (result.rows.length === 0)
			return res.status(401).json({ message: "Invalid username or password" });

		const user = result.rows[0];
		console.log(password, user.password)
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ message: "Invalid username or password" });

		const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ message: "Login successful", token });

	} catch (err) {
		console.error(err);
    	res.status(500).send("Database error");
	}
}