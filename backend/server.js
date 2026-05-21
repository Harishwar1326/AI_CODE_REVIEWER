const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const reviewRouter = require("./routes/review");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const defaultFrontendOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

for (const origin of configuredOrigins) {
  defaultFrontendOrigins.add(origin);
}

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || defaultFrontendOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
  }),
);
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/review", reviewRouter);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Code reviewer backend listening on port ${port}`);
  });
}

module.exports = app;
