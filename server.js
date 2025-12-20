import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.log(
    "Note: MONGO_URI not found in .env. Ensure it is set if using server-side features."
  );
}

// Routes
app.use("/api", apiRoutes);

// Static Asset Serving
// Explicitly serve these directories at root-level paths to match client import paths like '../components/X.js' -> '/components/X.js'
app.use("/components", express.static(path.join(__dirname, "components")));
app.use("/services", express.static(path.join(__dirname, "services")));
app.use("/views", express.static(path.join(__dirname, "views")));

// Serve Frontend Entry (at root)
app.use(express.static(path.join(__dirname, "views")));

// SPA Fallback: Serve index.html for unknown routes (fixes Unexpected token '<' for client-side routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
