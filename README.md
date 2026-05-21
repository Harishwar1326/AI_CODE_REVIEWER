# AI Code Reviewer

A full-stack AI-powered code reviewer that analyzes Python, C, Java, and C++ code using Groq-backed structured outputs.

## Features

- Code input via textarea or file upload
- Syntax-highlighted dark UI with IDE/terminal styling
- Structured review output with:
  - detected pattern name
  - code summary
  - issue list with severity labels
  - suggestions when needed
  - predictive future-risk analysis
  - simulated reviewer perspectives
- Express backend with validation and clean JSON errors
- Vite frontend with fast local development

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- AI Provider: Groq
- Validation: Zod

## Getting Started

1. Copy `.env.example` to `.env`.
2. Set `GROQ_API_KEY` in `.env`.
3. Install dependencies:

```bash
npm install
```

4. Start both apps in development:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Build

```bash
npm run build --workspace frontend
```

## API

- `GET /api/health` - health check
- `POST /api/review` - analyze submitted code

## Environment Variables

- `GROQ_API_KEY`
- `VITE_API_BASE_URL`

## Notes

The app does not use a database or authentication. All reviews are generated live from the Groq API.
