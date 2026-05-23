const Groq = require("groq-sdk");
const { z } = require("zod");

const riskLabelSchema = z.enum(["Low", "Moderate", "High", "Critical"]);
const timelineHorizonSchema = z.enum([
  "Immediate",
  "Near-term",
  "Mid-term",
  "Long-term",
]);
const perspectiveRoleSchema = z.enum([
  "Senior Engineer",
  "Security Engineer",
  "Performance Engineer",
  "Beginner Developer",
  "Production Reliability Engineer",
]);

const reviewJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    language: { type: "string" },
    detectedProblem: { type: "string" },
    codeSummary: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          severity: { type: "string", enum: ["Critical", "Warning", "Info"] },
          title: { type: "string" },
          description: { type: "string" },
          lineNumber: {
            anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }],
          },
        },
        required: ["severity", "title", "description", "lineNumber"],
      },
    },
    suggestions: {
      type: "object",
      additionalProperties: false,
      properties: {
        needed: { type: "boolean" },
        improvedCode: { type: "string" },
        explanation: { type: "string" },
      },
      required: ["needed", "improvedCode", "explanation"],
    },
    futureAnalysis: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskMeter: {
          type: "object",
          additionalProperties: false,
          properties: {
            score: { type: "number", minimum: 0, maximum: 100 },
            label: {
              type: "string",
              enum: ["Low", "Moderate", "High", "Critical"],
            },
            summary: { type: "string" },
            drivers: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 5,
            },
          },
          required: ["score", "label", "summary", "drivers"],
        },
        maintainabilityForecast: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            onboardingRisk: {
              type: "string",
              enum: ["Low", "Moderate", "High", "Critical"],
            },
            refactorTimeline: { type: "string" },
          },
          required: ["summary", "onboardingRisk", "refactorTimeline"],
        },
        technicalDebtTimeline: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              horizon: {
                type: "string",
                enum: ["Immediate", "Near-term", "Mid-term", "Long-term"],
              },
              risk: {
                type: "string",
                enum: ["Low", "Moderate", "High", "Critical"],
              },
              title: { type: "string" },
              description: { type: "string" },
              action: { type: "string" },
            },
            required: ["horizon", "risk", "title", "description", "action"],
          },
        },
        scalabilityHeatmap: {
          type: "array",
          minItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              area: { type: "string" },
              risk: {
                type: "string",
                enum: ["Low", "Moderate", "High", "Critical"],
              },
              description: { type: "string" },
            },
            required: ["area", "risk", "description"],
          },
        },
        vulnerabilityForecast: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              horizon: { type: "string" },
              severity: {
                type: "string",
                enum: ["Critical", "Warning", "Info"],
              },
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["horizon", "severity", "title", "description"],
          },
        },
      },
      required: [
        "riskMeter",
        "maintainabilityForecast",
        "technicalDebtTimeline",
        "scalabilityHeatmap",
        "vulnerabilityForecast",
      ],
    },
    perspectives: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: {
            type: "string",
            enum: [
              "Senior Engineer",
              "Security Engineer",
              "Performance Engineer",
              "Beginner Developer",
              "Production Reliability Engineer",
            ],
          },
          focus: { type: "string" },
          summary: { type: "string" },
          findings: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string" },
          },
          recommendation: { type: "string" },
        },
        required: ["role", "focus", "summary", "findings", "recommendation"],
      },
    },
    overallScore: { type: "number", minimum: 0, maximum: 100 },
  },
  required: [
    "language",
    "detectedProblem",
    "codeSummary",
    "issues",
    "suggestions",
    "futureAnalysis",
    "perspectives",
    "overallScore",
  ],
};

const reviewOutputSchema = z.object({
  language: z.string().min(1),
  detectedProblem: z.string().min(1),
  codeSummary: z.string().min(1),
  issues: z.array(
    z.object({
      severity: z.enum(["Critical", "Warning", "Info"]),
      title: z.string().min(1),
      description: z.string().min(1),
      lineNumber: z.number().int().positive().nullable(),
    }),
  ),
  suggestions: z.object({
    needed: z.boolean(),
    improvedCode: z.string(),
    explanation: z.string().min(1),
  }),
  futureAnalysis: z.object({
    riskMeter: z.object({
      score: z.number().min(0).max(100),
      label: riskLabelSchema,
      summary: z.string().min(1),
      drivers: z.array(z.string().min(1)).min(1).max(5),
    }),
    maintainabilityForecast: z.object({
      summary: z.string().min(1),
      onboardingRisk: riskLabelSchema,
      refactorTimeline: z.string().min(1),
    }),
    technicalDebtTimeline: z
      .array(
        z.object({
          horizon: timelineHorizonSchema,
          risk: riskLabelSchema,
          title: z.string().min(1),
          description: z.string().min(1),
          action: z.string().min(1),
        }),
      )
      .min(3),
    scalabilityHeatmap: z
      .array(
        z.object({
          area: z.string().min(1),
          risk: riskLabelSchema,
          description: z.string().min(1),
        }),
      )
      .min(4),
    vulnerabilityForecast: z.array(
      z.object({
        horizon: z.string().min(1),
        severity: z.enum(["Critical", "Warning", "Info"]),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    ),
  }),
  perspectives: z
    .array(
      z.object({
        role: perspectiveRoleSchema,
        focus: z.string().min(1),
        summary: z.string().min(1),
        findings: z.array(z.string().min(1)).min(1).max(4),
        recommendation: z.string().min(1),
      }),
    )
    .length(5),
  overallScore: z.number().min(0).max(100),
});

const languageLabels = {
  python: "Python",
  c: "C",
  java: "Java",
  cpp: "C++",
};

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured.");
    error.statusCode = 503;
    throw error;
  }

  return new Groq({ apiKey });
}

function buildSystemPrompt(languageLabel) {
  return [
    "You are an expert automated code reviewer for production software teams.",
    "Analyze the submitted code for bugs, security vulnerabilities, code smells, unused variables, redundant logic, poor naming, unsafe patterns, hardcoded secrets, inefficient loops, and language-specific best practice violations.",
    "Identify the primary code problem or algorithmic pattern by name, using a concise canonical label such as Binary Search, Two Sum, Armstrong Number, Fibonacci, or a similarly precise name when applicable.",
    "Summarize what the code is doing in plain English.",
    "Predict how this code may fail in the future by simulating scaling, maintainability, security, developer confusion, and performance risks.",
    "Generate a future risk meter, a technical debt timeline, a maintainability forecast, a scalability heatmap, and a future vulnerability forecast.",
    "Simulate five reviewer perspectives: Senior Engineer, Security Engineer, Performance Engineer, Beginner Developer, and Production Reliability Engineer.",
    "Each perspective must be grounded, concise, and distinct.",
    "Only recommend an improved code snippet when it is genuinely needed. If the code is already solid, set suggestions.needed to false, improvedCode to an empty string, and explain why no change is necessary.",
    "Label every issue as Critical, Warning, or Info.",
    "Use lineNumber only when you can tie the issue to a specific line in the submitted code.",
    "Return strict JSON only. Do not include markdown, code fences, commentary, or extra keys.",
    `The submitted language is ${languageLabel}.`,
  ].join(" ");
}

function normalizeLanguage(language) {
  return languageLabels[language] || "Python";
}

function extractFailedGeneration(error) {
  if (typeof error?.failed_generation === "string") {
    return error.failed_generation;
  }

  if (typeof error?.details?.failed_generation === "string") {
    return error.details.failed_generation;
  }

  const message = error?.message || "";
  // Try to locate a JSON-like substring after the failed_generation key.
  const fgIndex = message.indexOf("failed_generation");
  if (fgIndex === -1) return "";

  // Extract the first brace-delimited JSON object after the key.
  const after = message.slice(fgIndex);
  const firstBrace = after.indexOf("{");
  if (firstBrace === -1) return "";

  let depth = 0;
  let endIndex = -1;
  for (let i = firstBrace; i < after.length; i++) {
    const ch = after[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) return "";

  let candidate = after.slice(firstBrace, endIndex + 1);

  // Unescape common escaped quotes and newlines.
  candidate = candidate.replace(/\\\"/g, '"').replace(/\\n/g, "\\n");

  return candidate;
}

function deriveOverallScore(review) {
  if (typeof review?.overallScore === "number") {
    return review.overallScore;
  }

  if (typeof review?.futureAnalysis?.riskMeter?.score === "number") {
    return review.futureAnalysis.riskMeter.score;
  }

  return 100;
}

function normalizeReviewPayload(review) {
  return {
    ...review,
    overallScore: deriveOverallScore(review),
    suggestions: {
      needed: Boolean(review?.suggestions?.needed),
      improvedCode: review?.suggestions?.improvedCode || "",
      explanation: review?.suggestions?.explanation || "",
    },
    futureAnalysis: {
      ...review.futureAnalysis,
      riskMeter: {
        ...review.futureAnalysis.riskMeter,
        drivers: review.futureAnalysis.riskMeter.drivers || [],
      },
      vulnerabilityForecast: review.futureAnalysis.vulnerabilityForecast || [],
    },
  };
}

function parseFailedGenerationReview(error, languageLabel) {
  const failedGeneration = extractFailedGeneration(error);

  if (!failedGeneration) return null;

  // Attempt to parse the extracted JSON candidate.
  try {
    const parsed = JSON.parse(failedGeneration);
    const normalized = normalizeReviewPayload(parsed);
    const validated = reviewOutputSchema.safeParse(normalized);
    if (validated.success) {
      return { ...validated.data, language: languageLabel };
    }
  } catch (e) {
    // continue to build a minimal fallback below
  }

  // Build a minimal valid review to return instead of failing the request.
  const minimal = {
    language: languageLabel,
    detectedProblem: "Could not generate structured review.",
    codeSummary: "",
    issues: [],
    suggestions: {
      needed: false,
      improvedCode: "",
      explanation:
        "Groq failed to return a valid structured review. See failed_generation for raw output.",
    },
    futureAnalysis: {
      riskMeter: {
        score: 0,
        label: "Low",
        summary: "No data",
        drivers: ["No data"],
      },
      maintainabilityForecast: {
        summary: "No data",
        onboardingRisk: "Low",
        refactorTimeline: "",
      },
      technicalDebtTimeline: [
        {
          horizon: "Immediate",
          risk: "Low",
          title: "No data",
          description: "No technical debt information available.",
          action: "None",
        },
        {
          horizon: "Near-term",
          risk: "Low",
          title: "No data",
          description: "",
          action: "None",
        },
        {
          horizon: "Mid-term",
          risk: "Low",
          title: "No data",
          description: "",
          action: "None",
        },
      ],
      scalabilityHeatmap: [
        { area: "CPU", risk: "Low", description: "No data" },
        { area: "Memory", risk: "Low", description: "No data" },
        { area: "IO", risk: "Low", description: "No data" },
        { area: "Team", risk: "Low", description: "No data" },
      ],
      vulnerabilityForecast: [],
    },
    perspectives: [
      {
        role: "Senior Engineer",
        focus: "",
        summary: "",
        findings: [""],
        recommendation: "",
      },
      {
        role: "Security Engineer",
        focus: "",
        summary: "",
        findings: [""],
        recommendation: "",
      },
      {
        role: "Performance Engineer",
        focus: "",
        summary: "",
        findings: [""],
        recommendation: "",
      },
      {
        role: "Beginner Developer",
        focus: "",
        summary: "",
        findings: [""],
        recommendation: "",
      },
      {
        role: "Production Reliability Engineer",
        focus: "",
        summary: "",
        findings: [""],
        recommendation: "",
      },
    ],
    overallScore: 0,
  };

  return minimal;
}

async function reviewCode({ code, language }) {
  const client = getClient();
  const languageLabel = normalizeLanguage(language);

  let completion;

  try {
    completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "code_review",
          strict: true,
          schema: reviewJsonSchema,
        },
      },
      messages: [
        { role: "system", content: buildSystemPrompt(languageLabel) },
        {
          role: "user",
          content: [
            `Language: ${languageLabel}`,
            "Review this code and return the structured JSON response according to the schema.",
            "Required top-level keys: language, detectedProblem, codeSummary, issues, suggestions, futureAnalysis, perspectives, overallScore.",
            "Set issue lineNumber to an integer when available, otherwise use null.",
            "futureAnalysis must include riskMeter, maintainabilityForecast, technicalDebtTimeline, scalabilityHeatmap, and vulnerabilityForecast.",
            "perspectives must include exactly five reviewer viewpoints in this order: Senior Engineer, Security Engineer, Performance Engineer, Beginner Developer, Production Reliability Engineer.",
            "For future predictions, focus on believable engineering outcomes like growth-related breakage, increasing onboarding friction, duplicated logic, latency pressure, and future security regression risk.",
            "Keep the predictions specific to the submitted code instead of generic advice.",
            "Code:",
            code,
          ].join("\n"),
        },
      ],
    });
  } catch (error) {
    const fallbackReview = parseFailedGenerationReview(error, languageLabel);

    if (fallbackReview) {
      return fallbackReview;
    }

    const isMissingKey = error?.message?.includes("GROQ_API_KEY");
    const isSchemaValidationError =
      error?.code === "json_validate_failed" ||
      error?.message?.includes("json_validate_failed") ||
      error?.message?.includes("failed_generation");
    const isQuotaError =
      error?.status === 429 || error?.message?.includes("rate limit");
    const wrappedError = new Error(
      isMissingKey
        ? "GROQ_API_KEY is not configured."
        : isSchemaValidationError
          ? "Groq returned review data that did not match the schema. Please retry."
          : isQuotaError
            ? "Groq rate limit exceeded. Check your plan limits."
            : error?.message || "Groq request failed.",
    );
    wrappedError.statusCode = isMissingKey
      ? 503
      : isSchemaValidationError
        ? 502
        : isQuotaError
          ? 429
          : error?.status || 502;
    if (isSchemaValidationError && error?.failed_generation) {
      wrappedError.details = { failedGeneration: error.failed_generation };
    }
    throw wrappedError;
  }

  const messageContent = completion.choices?.[0]?.message?.content;
  const rawContent = Array.isArray(messageContent)
    ? messageContent
        .map((part) => {
          if (typeof part === "string") {
            return part;
          }

          if (part && typeof part === "object" && "text" in part) {
            return typeof part.text === "string" ? part.text : "";
          }

          return "";
        })
        .join("")
    : typeof messageContent === "string"
      ? messageContent
      : "";

  if (!rawContent) {
    const error = new Error("Groq returned an empty response.");
    error.statusCode = 502;
    throw error;
  }

  const normalizedContent = rawContent
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(normalizedContent);
  } catch (error) {
    const parsingError = new Error("Groq returned invalid JSON.");
    parsingError.statusCode = 502;
    parsingError.details = { rawContent };
    throw parsingError;
  }

  const validated = reviewOutputSchema.safeParse(parsedResponse);

  if (!validated.success) {
    const schemaError = new Error(
      "Groq returned review data that did not match the schema. Please retry.",
    );
    schemaError.statusCode = 502;
    schemaError.details = {
      issues: validated.error.issues,
      rawContent,
    };
    throw schemaError;
  }

  return {
    ...normalizeReviewPayload(validated.data),
    language: languageLabel,
  };
}

module.exports = {
  reviewCode,
};
