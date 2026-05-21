import { useCallback, useState } from "react";
import { reviewCode } from "../utils/api.js";

export default function useReview() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      const result = await reviewCode(payload);
      setReview(result);
      return result;
    } catch (analysisError) {
      setError(analysisError.message || "Unable to analyze the code.");
      throw analysisError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReview = useCallback(() => {
    setReview(null);
    setError("");
  }, []);

  return {
    review,
    loading,
    error,
    analyze,
    clearReview,
  };
}
