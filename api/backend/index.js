const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const reviewRouter = require("./routes/review");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: configuredOrigins.length ? configuredOrigins : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));

app.get(["/api/health", "/health"], (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/review", reviewRouter);
app.use("/review", reviewRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
