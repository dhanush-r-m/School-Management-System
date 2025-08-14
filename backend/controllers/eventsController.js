import { Events } from "../models/eventsSchema.js";

export const createEvent = async (req, res, next) => {
  console.log(req.body);
  const { title, description, date, location } = req.body;
  try {
    if (!title || !description || !date || !location) {
      return next(new Error("Please fill all fields!"));
    }
    await Events.create({ title, description, date, location });
    res.status(200).json({
      success: true,
      message: "Event Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Events.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    next(err);
  }
};
 
