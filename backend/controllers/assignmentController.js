// assignmentController.js

import { Assignment } from "../models/assignmentSchema.js";

export const createAssignment = async (req, res, next) => {
  console.log(req.body);
  const { title, description, dueDate, subject } = req.body;
  try {
    if (!title || !description || !dueDate || !subject) {
      return next(new Error("Please Fill Full Form!"));
    }
    await Assignment.create({ title, description, dueDate, subject });
    res.status(200).json({
      success: true,
      message: "Assignment Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (err) {
    next(err);
  }
}; 
