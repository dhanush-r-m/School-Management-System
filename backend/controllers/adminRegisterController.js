
import { Admin } from "../models/adminRegisterSchema.js";

export const registerAdmin = async (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(new Error("Please Fill Form!"));
    }
    await Admin.create({ name, email, password });
    res.status(200).json({
      success: true,
      message: "Admin Registered!",
    });
  } catch (err) {
    next(err);
  }
};


