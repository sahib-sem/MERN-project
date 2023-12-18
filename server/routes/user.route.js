import express from "express";
import { updateUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verify.user.js";

const router = express.Router();

router.patch("/user/:id", verifyUser,  updateUser);

export default router;