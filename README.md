<p align="center">
  <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="280" alt="DevHack Logo">
</p>

<h1 align="center">DevHack v2.0</h1>

<p align="center">
  <strong>The Ultimate Agentic Ecosystem for High-Performance Hackathon Teams and Organizers</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> | 
  <a href="#innovations">Innovations</a> | 
  <a href="#technical-stack">Technical Stack</a> | 
  <a href="#core-functionalities">Core Functionalities</a> | 
  <a href="#setup">Setup</a>
</p>

---

## Overview

**DevHack v2** is a revolutionary collaborative workspace and event management platform engineered for the modern hackathon era. It transforms the chaotic high-pressure environment of a hackathon into a streamlined, high-density innovation hub for both hackers and organizers. By integrating real-time intelligence with robust project and event management, DevHack v2 enables teams to transition from raw ideation to production-ready submissions with unparalleled speed while organizers monitor and direct the entire hackathon lifecycle perfectly.

## Innovations in v2

- **Next-Gen Architecture**: Migrated to Next.js 16 and React 19 for cutting-edge performance and developer experience.
- **Event Orchestration**: Fully integrated Organizer and Judge portals for granular event control, team scoring, and real-time timeline management.
- **Aggressive Real-Time Data**: Live leaderboard synchronization, rapid polling, and active cache-busting to ensure global state matches the second points are awarded.
- **Agentic Intelligence**: Integrated Antigravity AI capabilities for autonomous debugging, documentation generation, and problem analysis.

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Edge Logic** | Next.js Proxy (v16) |
| **Language** | TypeScript |
| **Library** | React 19 (Stable) |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL |
| **ORM** | Prisma |

## Core Functionalities

### Global Live Leaderboard
A real-time public scoreboard tracking team performances globally. Features a synchronized rapid clock module seamlessly recalculating dynamic task completions, project submissions, and manual rewards awarded live by organizers. 

### Organizer Control Room
An absolute command center for organizers. Monitor live team registration feeds, oversee global timeline schedules, manage custom problem statements, assign specific jury pools, and run an exclusive "Ceremony Mode" embargo masking live results until stage reveal.

### Rapid Reward Commits System
Hackers natively "Push Update" their research notes and development commits directly to the Organizer dashboard. Without leaving the commit log, organizers can immediately read logs, review progress, and organically reward explicit point values back into the live leaderboard.

### Secure Team Workspace Hub
High-density sprint management with secure invite-only codes. Includes native task tracking, dynamic markdown team notes, centralized resource libraries, and integrated final project submission portals.

### Jury Evaluation Portal
A dedicated, isolated scoring environment for event Judges to log into and assess team project submissions across metrics such as Innovation, Implementation, Design, and Impact, instantly feeding averages back to the global scoreboard.

### Polyglot Resource Library
Exhaustive documentation and boilerplate hub for over 75+ technology stacks, helping teams ship faster without leaving the environment to search the web recursively.

## Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL Database URL

### Setup Steps

1. **Clone the Repository**
```bash
git clone https://github.com/ckr-redlinedatavault/DevHack.git
cd DevHack
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create a `.env` file with the following keys:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="..."
```

4. **Initialize System**
```bash
npx prisma db push
npx prisma generate
```

5. **Start Innovation**
```bash
npm run dev
```

---
<p align="center">
  Built with passion by the DevHack Team
</p>
