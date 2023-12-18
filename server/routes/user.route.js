import express from "express";
import { updateUser, deleteUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verify.user.js";

const router = express.Router();

router.patch("/user/:id", verifyUser,  updateUser);
router.delete("/user/:id", verifyUser,  deleteUser);

export default router;