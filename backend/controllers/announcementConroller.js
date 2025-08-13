import { Announcement } from "../models/announcementSchema.js";

export const createAnnouncement = async (req, res, next) => {
  console.log(req.body);
  const { title, content, date } = req.body;
  try {
    if (!title || !content || !date) {
      return next(new Error("Please Fill Form!"));
    }
    await Announcement.create({ title, content, date });
    res.status(200).json({
      success: true,
      message: "Announcement Created!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (err) {
    next(err);
  }
};



