<p align="center">
  <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="280" alt="DevHack Logo">
</p>

<h1 align="center">DevHack</h1>

<p align="center">
  The Complete Vibe Coding Ecosystem for Hackathon Teams
</p>

<p align="center">
  <a href="#overview">Overview</a> | 
  <a href="#technical-stack">Technical Stack</a> | 
  <a href="#key-modules">Key Modules</a> | 
  <a href="#installation">Installation</a> | 
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

DevHack is a unified collaborative workspace designed specifically for hackathon participants. It bridges the gap between ideation and submission by providing a high-density environment to manage tasks, resources, and technical documentation in real-time. The platform focuses on a premium developer experience with a focus on efficiency during high-pressure coding sessions.

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Markdown** | React Markdown / Rehype Highlight |

| Infrastructure | Tool |
| :--- | :--- |
| **Runtime** | Node.js |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Auth** | NextAuth.js |
| **Email** | Resend |
| **API** | Axios |

| Development | Utility |
| :--- | :--- |
| **Package Manager** | npm |
| **Linting** | ESLint |
| **Styling Utils** | clsx / tailwind-merge |
| **Icons** | Lucide React |

## Key Modules

### Workspace Management
A centralized dashboard for team leads to initialize projects, manage member access through invite codes, and track overall progress through high-level statistics.

### Kanban Task System
A specialized task board designed for rapid iteration. It supports lifecycle stages from backlog to completion, optimized for the typical 24-48 hour hackathon window.

### Problem Discovery
A curated library of global problem statements, including real-time scrapers for events like SIH 2025, enabling teams to align their builds with verified challenges.

### Code Library and Resource Hub
An exhaustive technical resource covering 75+ technology stacks. It includes documentation links for core languages, frontend frameworks, backend systems, and cloud infrastructure.

### LLM Intelligence
An integrated AI co-pilot capable of debugging code, drafting documentation, and analyzing problem statements directly within the workspace environment.

## Installation

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL instance

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/ckr-redlinedatavault/DevHack.git
cd devhack
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a .env file and include:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="..."
```

4. Initialize the database
```bash
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

## Deployment

The application is optimized for deployment on the Vercel platform.

1. Ensure all environment variables are configured in the Vercel dashboard.
2. The post-install script will automatically handle Prisma client generation.
3. Build and deploy through the Vercel CLI or Git integration.
