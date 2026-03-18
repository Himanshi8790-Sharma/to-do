import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Get all tasks
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add Task
router.post("/", (req, res) => {
  const { title, dueDate } = req.body;

  const sql = "INSERT INTO tasks (title,completed,dueDate) VALUES (?,?,?)";

  db.query(sql, [title, false, dueDate], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      id: result.insertId,
      title,
      completed: false,
      dueDate,
    });
  });
});

// Delete Task
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM tasks WHERE id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task deleted" });
  });
});

// Update Task
router.put("/:id", (req, res) => {
  const { completed } = req.body;

  const sql = "UPDATE tasks SET completed=? WHERE id=?";

  db.query(sql, [completed, req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    const getTask = "SELECT * FROM tasks WHERE id=?";

    db.query(getTask, [req.params.id], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    });
  });
});

export default router;