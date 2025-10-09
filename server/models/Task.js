import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Task", taskSchema);
