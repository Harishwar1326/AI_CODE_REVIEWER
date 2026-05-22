export async function reviewCode({ code, language, fileName }) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const endpoint = baseUrl
    ? `${baseUrl}/api/backend/review`
    : "/api/backend/review";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, fileName }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      payload?.error?.message || "Unable to analyze the submitted code.";
    const error = new Error(errorMessage);
    error.details = payload?.error?.details;
    throw error;
  }

  return payload;
}
