// Vercel serverless entry — re-export the Express app from the backend
const app = require("./backend/index");

// Export the Express app so Vercel can handle requests.
module.exports = app;
