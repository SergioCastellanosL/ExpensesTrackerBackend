import express from "express";
import { getUsers, createUser, updateUser, deleteUser, searchUsers } from "../controllers/usersController.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/search", searchUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;