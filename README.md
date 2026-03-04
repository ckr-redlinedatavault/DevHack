<p align="center">
  <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="280" alt="DevHack Logo">
</p>

<h1 align="center">DevHack v2.0</h1>

<p align="center">
  <strong>The Ultimate Agentic Ecosystem for High-Performance Hackathon Teams</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> | 
  <a href="#innovations">Innovations</a> | 
  <a href="#technical-stack">Technical Stack</a> | 
  <a href="#key-modules">Key Modules</a> | 
  <a href="#setup">Setup</a>
</p>

---

## Overview

**DevHack v2** is a revolutionary collaborative workspace engineered for the modern hackathon era. It transforms the chaotic high-pressure environment of a hackathon into a streamlined, high-density innovation hub. By integrating autonomous agentic intelligence with robust project management, DevHack v2 enables teams to transition from raw ideation to production-ready submissions with unparalleled speed.

## Innovations in v2

- **Next-Gen Architecture**: Migrated to **Next.js 16** and **React 19** for cutting-edge performance and developer experience.
- **Agentic Intelligence**: Integrated **Antigravity AI** capabilities for autonomous debugging, documentation generation, and problem analysis.
- **Enhanced Reliability**: Comprehensive linting and type-safety optimizations across the entire stack.
- **Modernized Middleware**: Implementation of the new **Proxy** convention for secure, high-performance request handling.

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Edge Logic** | Next.js Proxy (v16) |
| **Language** | TypeScript |
| **Library** | React 19 (Stable) |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand |
| **Intelligence** | Antigravity Agentic AI |

| Infrastructure | Tool |
| :--- | :--- |
| **Runtime** | Node.js 20+ |
| **ORM** | Prisma / query-compiler-fast |
| **Cache** | Redis (ioredis) |
| **Database** | PostgreSQL |
| **Auth** | NextAuth.js |

## Key Modules

### Agentic Problem Discovery
Search and curate global problem statements from major events (SIH 2025, etc.) using automated scraping and AI categorization.

### Secure Workspace Hub
High-density project management with invite-only access, team statistics, and centralized resource management.

### Rapid-Iterate Kanban
A specialized task board designed for 24-48 hour sprints, featuring real-time status syncing and priority management.

### Polyglot Resource Library
Exhaustive documentation and boilerplate hub for over **75+ technology stacks**, helping teams ship faster without leaving the environment.

## Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL & Redis instances

### Setup Steps

1. **Clone the Repository**
```bash
git clone https://github.com/ckr-redlinedatavault/DevHack-v2.git
cd devhack
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create a `.env` file with the following keys:
```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="https://dev-hack-v2-xi.vercel.app"
```

4. **Initialize System**
```bash
npx prisma db push
npm run build
```

5. **Start Innovation**
```bash
npm run dev
```

---
<p align="center">
  Built with passion by the DevHack Team
</p>
