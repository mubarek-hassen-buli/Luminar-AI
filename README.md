# 🌟 Luminar AI — The Intelligent Academic Workspace

Luminar AI is a cutting-edge, AI-powered academic platform designed to transform dense study materials into interactive visual mind maps and personalized explanations. Built for students and researchers, it leverages state-of-the-art Generative AI to make learning more immersive, efficient, and fun.

![SaaS Landing Page Preview](https://res.cloudinary.com/dyd911kmh/image/upload/v1739547500/luminar-hero_preview.png)

## 🚀 Key Features

-   **Modern SaaS Landing Page**: A stunning, dark-themed entry point with animated gradients and responsive design.
-   **AI Mind Maps**: Transform PDFs and DOCX files into interactive, hierarchical concept graphs using **React Flow**.
-   **RAG-Powered Explanations**: Concepts are explained using your specific materials as context, ensuring accuracy via **Retrieval-Augmented Generation (RAG)**.
-   **Multiple Learning Styles**:
    -   **Logical**: Deep academic breakdowns.
    -   **Funny**: Humorous, relatable analogies.
    -   **Movie Analogy**: Comparisons to popular cinema for better retention.
-   **Infinite Study Canvas**: A dedicated full-screen workspace to explore complex subjects without limits.
-   **Secure Authentication**: Full suite of auth features (Login, Sign-up, Logout) powered by **BetterAuth**.
-   **Smart Usage Limits**: Built-in free tier management (3 workspaces, 1 material per workspace).

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
-   **Visualization**: [React Flow](https://reactflow.dev/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)

### Backend
-   **Server**: [Hono](https://hono.dev/) (Node.js runtime)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) ([Neon](https://neon.tech/)) with `pgvector`
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
-   **Auth**: [BetterAuth](https://www.better-auth.com/)
-   **Storage**: [Cloudinary](https://cloudinary.com/)

## 📂 Project Structure

```text
luminar-ai/
├── backend/            # Hono server, services, and AI logic
│   ├── src/
│   │   ├── ai/         # Gemini configuration
│   │   ├── config/     # Auth and DB connections
│   │   ├── services/   # Business logic (MindMaps, Explanations, RAG)
│   │   └── routes/     # API endpoints
├── frontend/           # Next.js application
│   ├── app/            # Pages and layouts
│   ├── components/     # UI and workspace-specific components
│   ├── hooks/          # Custom TanStack Query hooks
│   └── lib/            # Shared utilities (API & Auth clients)
```

## 🏁 Getting Started

### Prerequisites
-   Node.js 20+
-   Neon PostgreSQL Database (with `pgvector` enabled)
-   Google Gemini API Key
-   Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/mubarek-hassen-buli/Luminar-AI.git
cd Luminar-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=3001
DATABASE_URL=your_neon_postgres_url
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3001
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```
Initialize DB:
```bash
npx drizzle-kit push
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Running the Project
Open two terminals:
-   **Backend**: `cd backend && npm run dev`
-   **Frontend**: `cd frontend && npm run dev`

Visit [http://localhost:3000](http://localhost:3000) to see Luminar AI in action!

## 📜 License
Built with ❤️ by students, for students. Free to use and contribute.

---
*Luminar AI — Shine light on your learning.*
