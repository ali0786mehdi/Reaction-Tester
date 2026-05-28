# ⚡ Aesthetic Reaction Tester

[![Play Live](https://img.shields.io/badge/Play_Live-Game-3b82f6?style=for-the-badge&logo=github)](https://ali0786mehdi.github.io/Reaction-Tester/)
[![GitHub stars](https://img.shields.io/github/stars/ali0786mehdi/Reaction-Tester?style=for-the-badge)](https://github.com/ali0786mehdi/Reaction-Tester/stargazers)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A sleek, modern web application designed to test and improve your reflexes and aiming speed.

Originally built as a client-side experience, this application is evolving into a full-stack platform. It features a gamified **Aim + Reaction** mechanic, requiring users to quickly locate and click a randomly spawning target, while now offering secure user authentication to track performance, save high scores, and monitor rolling averages across sessions.

---

## ✨ Features

* 🔐 **Secure User Authentication:** Create an account and log in to securely save your reaction times. Every session is linked directly to your profile.
* 🎯 **Aim & React Mechanics:** Targets spawn in random locations within the play area, testing both cursor accuracy and raw reflex speed.
* 📊 **Personal Performance Dashboard:** Automatically tracks your current rounds, calculates your rolling average, and persistently saves your all-time best score to the database.
* ⏱️ **High-Precision Timing:** Utilizes high-resolution browser APIs for microsecond-level accuracy, ensuring professional-grade testing.
* 🎨 **Modern Minimalist UI:** A beautifully crafted, distraction-free interface featuring a sleek dark mode color palette, smooth transitions, and an elegant layout.
* 📱 **Fully Responsive:** Optimized for both desktop (mouse) and mobile (touch) experiences.

---

## 🛠️ Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | Next.js, React, TypeScript |
| **Styling** | Modern CSS / Tailwind CSS |
| **Backend** | Next.js API Routes / Server Actions |
| **Database** | Prisma ORM, PostgreSQL (or similar) |
| **Auth** | NextAuth.js / Clerk |

---

## 🚀 Getting Started

To run the full-stack version of this project locally, you will need **Node.js** and a package manager installed.

### 1. Clone the repository
```bash
git clone [https://github.com/ali0786mehdi/Reaction-Tester.git](https://github.com/ali0786mehdi/Reaction-Tester.git)
cd Reaction-Tester
2. Install dependencies
Bash
npm install
# or use yarn / pnpm
3. Configure Environment Variables
Create a .env file in the root directory and add your database connection string and authentication secrets:

Code snippet
DATABASE_URL="your_database_connection_string"
AUTH_SECRET="your_secure_auth_secret"
4. Initialize the Database
Push the Prisma schema to your database to create the required tables for users and scores.

Bash
npx prisma db push
5. Start the development server
Bash
npm run dev
Open http://localhost:3000 in your browser to see the result.

📝 Roadmap
[x] Core Aim & Reaction Mechanics

[x] Client-side score calculation

[ ] User Authentication (Login / Sign Up)

[ ] Database integration for persistent score tracking

[ ] Global Leaderboard implementation
