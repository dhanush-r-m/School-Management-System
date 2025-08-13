import { Book } from "../models/librarySchema.js";

export const createBook = async (req, res, next) => {
  console.log(req.body);
  const { title, author, isbn, quantity } = req.body;
  try {
    if (!title || !author || !isbn || !quantity) {
      return next(new Error("Please fill all fields!"));
    }
    await Book.create({ title, author, isbn, quantity });
    res.status(200).json({
      success: true,
      message: "Book Added!",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      success: true,
      books,
    });
  } catch (err) {
    next(err);
  }
};


