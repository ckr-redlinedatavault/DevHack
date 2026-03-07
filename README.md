<p align="center">
  <img src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png" width="280" alt="DevHack Logo">
</p>

<h1 align="center">DevHack v2.5</h1>

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

**DevHack v2.5** is a revolutionary collaborative workspace and event management platform engineered for the modern hackathon era. It transforms the chaotic high-pressure environment of a hackathon into a streamlined, high-density innovation hub. 

By integrating real-time intelligence with robust project and event management, DevHack enables teams to transition from raw ideation to production-ready submissions with unparalleled speed while organizers monitor and direct the entire hackathon lifecycle with precision.

## Innovations in v2.5

- **Secure Lead Approval Flow**: A new robust "Request-to-Join" system where invited users must be vetted and approved by Team Leads before gaining workspace access.
- **Ultra-Minimalist Agentic Chat**: A refined, pitch-black AI assistant UI designed for zero-distraction debugging and rapid technical support.
- **Real-Time Synchronicity**: Powered by Socket.io, the platform now supports live status updates for events, instant leaderboard refreshes, and real-time team collaboration.
- **Sanitized Communication Layer**: High-integrity email invitation system enforcing strict RFC 5321 standards to ensure 100% deliverability.
- **Cross-Device Performance**: Fully responsive architecture ensuring that organizers can manage the event from a mobile device as easily as from a desktop.

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Edge Logic** | Node.js Runtime (v20+) |
| **Real-Time** | Socket.io |
| **Language** | TypeScript |
| **AI Integration** | Google Gemini (Generative AI) |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL |
| **ORM** | Prisma |

## Core Functionalities

### 🛡️ Team Lead Control Center
Move beyond simple invite codes. Team Leads now have absolute authority over their roster, managing pending join requests with a single click and maintaining team integrity.

### 📊 Organizer Command Room
A powerful dashboard for event hosts to oversee global timelines, manage custom problem statements, assign jury pools, and run "Ceremony Mode" for high-stakes result reveals.

### 🤖 Agentic AI Workspace
Integrated Google Gemini capabilities allow for autonomous debugging, documentation fetching, and problem analysis, helping hackers stay in the "flow state" longer.

### 📈 Live Leaderboard & Rewards
A synchronized public scoreboard tracking performance. Organizers can reward points directly from commit logs, instantly reflecting on the global stage.

### ⚖️ Jury Evaluation Portal
An isolated environment for judges to score projects across Innovation, Design, and Impact metrics, with automatic average calculations feeding into live results.

## Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL Database
- Redis (for Socket.io scaling if needed)

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
GEMINI_API_KEY="..."
```

4. **Initialize Database**
```bash
npx prisma db push
npx prisma generate
```

5. **Run the Development Server**
```bash
npm run dev
```

---
<p align="center">
  Built with passion by <strong>Redlix Systems</strong> & <strong>Dhasha Media</strong>
</p>
