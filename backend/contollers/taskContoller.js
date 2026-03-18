const Task = require("../models/Task");

// Get Task
exports.getTasks = async (req,res)=>{
    const tasks = await Task.find();
    res.json(tasks);
};

// Post Task
exports.addTask = async(req,res)=>{
 const task = await Task.create(req.body);
 res.json(task);
};