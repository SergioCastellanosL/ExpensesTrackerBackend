import express from "express";
import { createAccount} from "../controllers/accountsController.js";
import {authenticate} from "../middleware/auth.js"
const router = express.Router();

//router.get("/", getUsers);
router.post("/", authenticate,createAccount);
//router.put("/:id", updateUser);
//router.delete("/:id", deleteUser);

export default router;