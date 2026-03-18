import express from "express";
import cors from "cors";
import db from "./config/db.js";
import taskRoutes from "./routes/tasks.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
