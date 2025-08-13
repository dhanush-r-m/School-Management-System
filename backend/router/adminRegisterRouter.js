import express from "express";
import { adminSignIn } from "../controllers/usersController.js";
import { registerAdmin } from "../controllers/adminRegisterController.js";

const router = express.Router();


router.post('/signin', adminSignIn);
router.post('/admin', registerAdmin);

export default router;

