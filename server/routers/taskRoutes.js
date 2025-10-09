import express from "express";
import Task from "../models/Task.js";
const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Add new task
router.post("/", async (req, res) =>{
  try {
    const {title, dueDate} = req.body;
    const newTask = new Task ({title, dueDate});
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Bad Request", error: error.message });
  }
});

// Delete task
router.delete("/:id", async (req,res)=>{
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if(!deleted){
      return res.status(404).json({message: "Task not found"});
    }
    res.json({message: "Task deleted"});
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Update task
router.put ("/:id", async (req, res)=>{
 try {
  const { title, dueDate, completed } = req.body;
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    {title, dueDate, completed},
    {new: true} );
    if(!updated){
      return res.status(404).json({message: "Task not found"});
    }
    res.json(updated);
 } catch (error) {
   res.status(400).json({ message: "Bad Request", error: error.message });

 }
});


export default router;
