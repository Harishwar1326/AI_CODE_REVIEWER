function notFound(_req, res) {
  res.status(404).json({
    error: {
      message: "Route not found.",
    },
  });
}

function errorHandler(err, _req, res, _next) {
  const isMalformedJson =
    err.type === "entity.parse.failed" || err instanceof SyntaxError;
  const statusCode = isMalformedJson
    ? 400
    : err.statusCode || err.status || 500;
  const message = isMalformedJson
    ? "Invalid JSON payload."
    : statusCode === 500
      ? "Internal server error."
      : err.message;
  const payload = {
    error: {
      message,
    },
  };

  if (err.details) {
    payload.error.details = err.details;
  }

  if (
    statusCode === 500 &&
    process.env.NODE_ENV !== "production" &&
    err.stack
  ) {
    payload.error.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = {
  notFound,
  errorHandler,
};
