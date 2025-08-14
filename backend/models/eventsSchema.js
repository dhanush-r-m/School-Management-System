import mongoose from "mongoose";
import validator from "validator";

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});


export const Events = mongoose.model('Events', eventsSchema);



