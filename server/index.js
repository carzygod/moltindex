import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import siteRoutes from "./routes/sites.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/moltindex";

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(morgan("tiny"));
app.use(express.json());

app.get("/api/status", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/sites", siteRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error, _req, res, _next) => {
  console.error("Server error", error);
  res.status(500).json({ error: error?.message ?? "Internal server error" });
});

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo, starting Moltindex API on port", PORT);
    app.listen(PORT, () => {
      console.log(`Moltindex API ready at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to MongoDB", error);
    process.exit(1);
  });
