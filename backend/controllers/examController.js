
import { Exam } from "../models/examSchema.js";

export const createExam = async (req, res, next) => {
  console.log(req.body);
  const { subject, date, duration, totalMarks } = req.body;
  try {
    if (!subject || !date || !duration || !totalMarks) {
      return next(new Error("Please fill out all fields!"));
    }
    await Exam.create({ subject, date, duration, totalMarks });
    res.status(200).json({
      success: true,
      message: "Exam Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    res.status(200).json({
      success: true,
      exams,
    });
  } catch (err) {
    next(err);
  }
};
