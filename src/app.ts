import express from "express";
import { connectDB } from "./config/db.js";
import medicationRoutes from "./routes/medication.js";
import recordRoutes from "./routes/record.js";

const app = express();

app.use(express.json());

// Conectar a MongoDB
connectDB();

app.use("/medications", medicationRoutes);
app.use("/records", recordRoutes);

export default app;
