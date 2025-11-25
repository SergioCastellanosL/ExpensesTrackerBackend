import express from "express";
import { createAccount, getAccounts, editAccount, deleteAccount, getAccount} from "../controllers/accountsController.js";
import {authenticate} from "../middleware/auth.js"
const router = express.Router();

router.get("/", authenticate, getAccounts);
router.post("/", authenticate, createAccount);
router.put("/:accountId",authenticate, editAccount);
router.delete("/:accountId",authenticate, deleteAccount);
router.get("/:accountId",authenticate, getAccount);

export default router;