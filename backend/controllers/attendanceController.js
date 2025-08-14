import Attendance from "../models/attendanceSchema.js";

export const markAttendance = async (req, res, next) => {
  console.log(req.body);
  const { studentId, date, status } = req.body;
  try {
    if (!studentId || !date || !status) {
      return next(new Error("Attendance data is missing or invalid!"));
    }
    await Attendance.create({ studentId, date, status });
    res.status(200).json({
      success: true,
      message: "Attendance marked successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find();
    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (err) {
    next(err);
  }
};
