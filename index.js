import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const {Pool} = pkg;
const app= express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_KEY

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection failed:", err));

pool.query(`
	CREATE TABLE IF NOT EXISTS users (
	 id SERIAL PRIMARY KEY,
	 username VARCHAR(50) UNIQUE NOT NULL,
	 password TEXT NOT NULL,
	 created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
	);
`).catch(err => console.log(err));

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.post("/users", async (req, res) => {
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
});

app.put("/users/:id", async (req,res) =>{
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
});

app.delete("/users/:id", async (req, res) =>{
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
});

app.post("/login", async (req,res) => {
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
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
