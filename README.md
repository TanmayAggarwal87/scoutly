# Scoutly

An automated job intelligence platform designed to aggregate, filter, and track career opportunities across diverse sources.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

Scoutly is a full-stack job aggregation engine that automates the tedious process of searching for roles across multiple platforms. By combining customized web scraping, keyword matching, and real-time notifications, it provides a centralized command center for career growth.

---

## Visual Diagrams

### System Architecture
```mermaid
graph TD
    User((User))
    Client[Next.js Frontend]
    Server[Node.js Express API]
    DB[(MongoDB)]
    Scraper[Scraper Service]
    Matcher[Matching Engine]
    Notifier[Notification Service]

    User <--> Client
    Client <--> Server
    Server <--> DB
    Scraper --> DB
    DB --> Matcher
    Matcher --> Notifier
    Notifier --> User
```

### Data Flow: Job Ingestion & Matching
```mermaid
sequenceDiagram
    participant S as Scraper Service
    participant DB as MongoDB
    participant M as Matcher Engine
    participant N as Notifier
    participant U as User

    S->>DB: Save New Job Listings
    DB->>M: Trigger Matching for User Keywords
    M->>M: Score Job Relevance
    M->>DB: Update Match Status
    DB->>N: Trigger Alert
    N->>U: Send Notification
```

### Entity Relationship Diagram
```mermaid
erDiagram
    USER ||--o{ SOURCE : manages
    USER ||--o{ NOTIFICATION : receives
    USER {
        string id
        string email
        string password
        array keywords
    }
    SOURCE ||--o{ JOB : contains
    SOURCE {
        string id
        string name
        string url
        boolean isActive
    }
    JOB {
        string id
        string title
        string company
        string description
        string link
    }
    NOTIFICATION {
        string id
        string userId
        string message
        boolean isRead
    }
```

---

## Problem Statement

Job seekers often find themselves overwhelmed by the sheer volume of platforms they must monitor daily. This fragmentation leads to missed opportunities, repetitive searches, and information fatigue. Manually filtering jobs based on specific niche keywords across dozens of career pages is inefficient and prone to human error.

---

## Solution Overview

Scoutly solves this by decoupling the search process from the user. It utilizes a background scraping service that monitors targeted job sources, stores metadata in a unified database, and runs a matching algorithm against user-defined preferences. Instead of "searching" for jobs, users "receive" curated opportunities that match their specific technical stack and interest.

---

## Key Features

*   Automated Job Aggregation: Scrapes multiple sources periodically without manual intervention.
*   Custom Keyword Matching: Intelligent filtering based on user-defined skill sets and preferences.
*   Source Management: Ability to enable/disable specific job boards or company career pages.
*   Centralized Dashboard: A clean, unified interface to view, track, and manage job applications.
*   Notification System: Real-time alerts when high-relevance jobs are detected.

---

## Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | Next.js 15 (App Router) | High-performance React framework for the UI |
| Backend | Node.js / Express | Scalable API and background service orchestration |
| Database | MongoDB | Flexible schema for varying job listing structures |
| Language | TypeScript / JavaScript | Type safety and reliable development patterns |
| Styling | Tailwind CSS | Utility-first styling for responsive design |
| UI Components | Radix UI / Shadcn | Accessible and consistent interface elements |

---

## Quick Start / Installation

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance (Local or Atlas)

### Server Setup
```bash
cd server
npm install
# Configure your .env file
npm start
```

### Client Setup
```bash
cd client
npm install
# Configure your .env file
npm run dev
```

---

## Environment Variables

| Variable | Description | Example | Required |
| :--- | :--- | :--- | :--- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/scoutly` | Yes |
| `JWT_SECRET` | Secret key for auth tokens | `your_super_secret_key` | Yes |
| `PORT` | Backend server port | `5000` | No |
| `NEXT_PUBLIC_API_URL` | Frontend API reference | `http://localhost:5000` | Yes |

Example `.env` (Server):
```text
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/scoutly
JWT_SECRET=b64_encoded_string
PORT=5000
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/jobs` | Retrieve filtered job list | Yes |
| POST | `/api/sources` | Add a new job source | Yes |
| PATCH | `/api/user/preferences` | Update matching keywords | Yes |

**Example Request (Get Jobs):**
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <your_token>"
```

---

## Project Structure

```text
.
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # UI and logic components
│   │   └── lib/           # API utilities
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Scraper, Matcher, Notifier
│   │   └── middleware/    # Auth and error handling
└── README.md
```

---

## Deployment & Architecture Decisions

### Architecture Decisions
*   Monorepo Approach: Chosen for simplified local development and shared context, though logical separation is maintained between the scraper and the API.
*   Document-Oriented Storage: MongoDB was selected because job listings from different sites have inconsistent formats. A schema-less approach allows for flexible metadata storage.

### Deployment Recommendation
*   Frontend: Vercel (Optimized for Next.js).
*   Backend: Render or Railway (Supports persistent Node.js processes for scrapers).
*   Database: MongoDB Atlas (Managed scaling).

---

## Technical Challenges & Solutions

### Challenge 1: Scraper Resilience
**Problem:** Websites frequently change their DOM structure, causing scrapers to break.
**Solution:** Implemented a modular source system (`Source.js`) that allows for source-specific selectors. If a scraper fails, the system logs the error and marks the source for review without crashing the entire service.

### Challenge 2: Efficient Job Matching
**Problem:** Comparing every new job against every user's keywords can become O(n*m) as the database grows.
**Solution:** Utilized MongoDB text indexing and the `matcher.js` service to run targeted queries rather than iterating through records in memory, significantly reducing CPU overhead.

---

## Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server |
| `node src/index.js` | Starts Express backend |
| `node src/manual_scrape.js` | Triggers scraper manually for testing |
| `npm run build` | Builds production frontend assets |

---

## Testing Approach

The current testing focus is on:
*   Integration Testing: Validating the flow between the Scraper and the Database.
*   API Testing: Ensuring JWT-protected routes reject unauthorized requests.
*   Planned: Unit tests for the `matcher.js` logic using Jest to ensure high-precision filtering.

---

## Contributing Guidelines

Contributions are welcome. If you have an idea for a new scraper or a better matching algorithm, please fork the repository and submit a pull request. We value clean code and descriptive commit messages.

---

## License

This project is licensed under the MIT License.

---

## Author Section

Built by [Tanmay Aggarwal](https://github.com/TanmayAggarwal87)

--made by [docify](https://docify-two.vercel.app/) --
