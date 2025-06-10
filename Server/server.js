import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// CORS settings
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost"],
  credentials: true,
};
app.use(cors(corsOptions));

// middleware
app.use(express.json());

// Add request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
})

// mongoDB connect
try {
  connectDB();
  console.log("MongoDB connection established");
} catch (error) {
  console.log("MongoDB connection failed, but server will continue running");
  console.error(error);
}

// API routes
app.use("/api", routes);

// Request not found
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Endpoint not found" });
});

// start Server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api`);
});
