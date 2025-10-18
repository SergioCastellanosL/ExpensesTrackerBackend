import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const {Pool} = pkg;
const app= express();
app.use(cors());
app.use(express.json());

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
		await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
		res.status(201).send("User added");
	}catch(err){
		console.error(err);
		res.status(500).send("Database error");
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
