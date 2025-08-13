import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post('/', markAttendance);
router.get('/getall', getAttendance);

export default router;
