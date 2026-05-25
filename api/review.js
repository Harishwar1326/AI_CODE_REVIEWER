const { parseReviewRequest } = require("./backend/middleware/validate");
const { reviewCode } = require("./backend/services/openaiService");

function sendError(res, error) {
  const isMalformedJson =
    error.type === "entity.parse.failed" || error instanceof SyntaxError;
  const statusCode = isMalformedJson
    ? 400
    : error.statusCode || error.status || 500;
  const payload = {
    error: {
      message: isMalformedJson
        ? "Invalid JSON payload."
        : statusCode === 500
          ? "Internal server error."
          : error.message,
    },
  };

  if (error.details) {
    payload.error.details = error.details;
  }

  res.status(statusCode).json(payload);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      error: {
        message: "Method not allowed.",
      },
    });
    return;
  }

  const parsed = parseReviewRequest(req.body);

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join(".") || "request",
      message: issue.message,
    }));

    res.status(400).json({
      error: {
        message: "Invalid review request.",
        details,
      },
    });
    return;
  }

  try {
    const review = await reviewCode(parsed.data);
    res.json(review);
  } catch (error) {
    sendError(res, error);
  }
};
