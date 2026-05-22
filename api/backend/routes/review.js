const express = require("express");
const { validateReviewRequest } = require("../middleware/validate");
const { reviewCode } = require("../services/openaiService");

const router = express.Router();

router.post("/", validateReviewRequest, async (req, res, next) => {
  try {
    const review = await reviewCode(req.validatedReviewInput);
    res.json(review);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
