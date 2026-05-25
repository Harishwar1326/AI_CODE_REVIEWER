const { z } = require("zod");

const supportedLanguages = ["python", "c", "java", "cpp"];

const reviewRequestSchema = z.object({
  code: z
    .string({ required_error: "Code is required." })
    .trim()
    .min(1, "Code cannot be empty.")
    .max(5000, "Code must be 5000 characters or less."),
  language: z.enum(supportedLanguages, {
    required_error: "Language is required.",
    invalid_type_error: "Language must be python, c, java, or cpp.",
  }),
  fileName: z.string().max(255).optional(),
});

function parseReviewRequest(body) {
  return reviewRequestSchema.safeParse(body);
}

function validateReviewRequest(req, res, next) {
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

  req.validatedReviewInput = parsed.data;
  next();
}

module.exports = {
  supportedLanguages,
  parseReviewRequest,
  validateReviewRequest,
};
