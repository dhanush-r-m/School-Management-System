import { Class } from "../models/classSchema.js";

export const createClass = async (req, res, next) => {
  console.log(req.body);
  const { className, section, teacher } = req.body;
  try {
    if (!className || !section || !teacher) {
      return next(new Error("Please Fill Form!"));
    }
    await Class.create({ className, section, teacher });
    res.status(200).json({
      success: true,
      message: "Class Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find();
    res.status(200).json({
      success: true,
      classes,
    });
  } catch (err) {
    next(err);
  }
};
 
