import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import accountsRoutes from "./routes/accounts.js";

dotenv.config();

const app= express();
app.use(cors());
app.use(express.json());

//Routes
app.use("/", authRoutes);
app.use("/accounts", accountsRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
