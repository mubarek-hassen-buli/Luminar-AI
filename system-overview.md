## Luminar AI

AI-Powered Academic Workspace & Contextual Mind Mapping System

## System Overview

### Product Summary

Luminar AI is a structured learning platform where students:

Create workspaces

Upload one study material per workspace (free plan limit: 3 workspaces)

Generate an expandable hierarchical mind map

Request contextual explanations:

Real-world example

Funny explanation

Movie-based analogy

The system uses LLM orchestration and vector retrieval to transform static academic content into structured, interactive knowledge.



## High-Level Architecture

### Frontend

Built with Next.js

Interactive mind map via React Flow

UI with Tailwind + Shadcn

zod for schema validation 

tanstack query for data fetching

### Backend

API built using Hono

Authentication via BetterAuth

Database: Neon

ORM: Drizzle ORM

Vector storage: pgvector extension inside Neon

AI model: Gemini

File storage: cloudinary (recommended)

zod for schema validation   