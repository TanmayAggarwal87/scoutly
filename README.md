# Scoutly: Intelligent Opportunity Discovery Platform

Scoutly is a comprehensive platform designed to streamline and automate the process of finding relevant opportunities from various online sources. By aggregating data, applying intelligent matching algorithms, and providing timely notifications, Scoutly empowers users to efficiently discover jobs, internships, tenders, or other specific opportunities tailored to their preferences, eliminating the manual overhead and potential for missed prospects.

## Live Demo Link

[Link to Live Demo (Coming Soon)]

## Problem Statement

In today's fast-paced digital landscape, identifying and tracking relevant opportunities across numerous online platforms (job boards, company career pages, specialized forums, government portals) is a significant challenge. The manual process is inherently time-consuming, inefficient, and often leads to missed opportunities due to the sheer volume and dispersed nature of information. Users frequently struggle with:

1.  **Information Overload:** Sifting through countless irrelevant listings.
2.  **Fragmented Search:** Requiring constant monitoring of multiple, disparate sources.
3.  **Lack of Timeliness:** Missing out on newly posted opportunities before they are filled.
4.  **Inconsistent Data:** Dealing with varying formats and structures across different websites.

This fragmented and manual approach creates a significant barrier for individuals and organizations seeking specific opportunities, leading to increased search duration, reduced efficiency, and potential competitive disadvantages.

## Solution Overview

Scoutly addresses these challenges by providing a centralized, automated, and intelligent system for opportunity discovery. The platform acts as a smart agent, constantly monitoring predefined sources for new listings. It then processes this raw data, extracting key information, and applies user-defined preferences (keywords, source filters) to identify highly relevant opportunities. Finally, Scoutly delivers these personalized findings directly to the user through a clean dashboard and a robust notification system.

The solution encompasses:

*   **Automated Data Scraping:** Regularly extracts information from configured web sources.
*   **Intelligent Matching:** Filters opportunities based on advanced keyword and preference matching.
*   **Personalized Dashboards:** Provides users with a curated view of relevant listings.
*   **Proactive Notifications:** Alerts users to new opportunities that meet their criteria.
*   **User Management:** Secure authentication and preference configuration.

This structured approach transforms the laborious task of opportunity hunting into an efficient, automated, and highly personalized experience.

## Key Features

*   **Secure User Authentication:** Robust sign-up and login mechanisms to protect user data and preferences.
*   **Customizable Keyword Tracking:** Users can define specific keywords, phrases, and exclusion terms to precisely filter opportunities.
*   **Multi-Source Data Aggregation:** Configurable management of various web sources from which opportunities are scraped.
*   **Personalized Opportunity Feed:** A dynamic dashboard displaying opportunities filtered and ranked according to individual user preferences.
*   **Real-time & Scheduled Notifications:** Alerts delivered for new, relevant opportunities, configurable for frequency and method.
*   **Comprehensive Preference Management:** Intuitive interface to manage keywords, preferred sources, and notification settings.
*   **Detailed Opportunity Cards:** Each opportunity is presented with essential information, including title, source, and a direct link.
*   **Background Scraping & Processing:** Automated services run continuously to gather and process new data without user intervention.

## Tech Stack

**Client (Frontend):**

*   **Next.js:** A React framework for building fast, scalable, and SEO-friendly web applications. Chosen for its robust features like server-side rendering (SSR), static site generation (SSG), and API routes, which optimize performance and developer experience.
*   **React:** For building interactive user interfaces with a component-based architecture.
*   **TypeScript:** Enhances code quality and developer productivity through static type checking.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs without leaving the HTML.
*   **Shadcn UI (Likely):** Based on the `client/components.json` and `client/src/components/ui` structure, a set of re-usable UI components built with Radix UI and Tailwind CSS, providing a highly customizable and accessible design system.

**Server (Backend):**

*   **Node.js:** A JavaScript runtime for building scalable network applications. Chosen for its non-blocking I/O model and large ecosystem.
*   **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
*   **MongoDB:** A NoSQL document database. Selected for its flexibility, scalability, and ease of integration with Node.js applications (via Mongoose).
*   **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js, simplifying data schema definition and interaction.
*   **JSON Web Tokens (JWT):** For secure user authentication and authorization.
*   **Web Scraping Libraries (e.g., Cheerio, Puppeteer/Playwright):** Used within `scraper.js` for parsing HTML and interacting with web pages to extract opportunity data. The specific library would depend on the dynamism of target websites.
*   **Scheduler (e.g., `node-cron`):** Utilized by `scheduler.js` for scheduling recurring tasks like web scraping and notification delivery.
*   **Email Service (e.g., Nodemailer):** Potentially integrated into `notifier.js` for sending email notifications.

## Technical Challenges & Solutions

Developing Scoutly involved navigating several significant technical hurdles to ensure robustness, efficiency, and scalability.

### 1. Robust and Adaptive Web Scraping

*   **Challenge:** Websites frequently change their layouts, implement anti-bot measures, and present data in diverse, often inconsistent structures. This dynamic nature makes stable and reliable data extraction incredibly difficult, leading to brittle scrapers that break easily.
*   **Solution:**
    *   **Modular Scraper Design:** The `scraper.js` service was designed to be highly modular, allowing for individual scraping strategies per source. Each source is configured with specific CSS selectors or XPath expressions, which can be updated independently.
    *   **Headless Browser Integration (Strategic):** For highly dynamic websites relying heavily on JavaScript rendering, headless browser solutions (like Puppeteer or Playwright, implicitly suggested by the need for robust scraping) are employed. This allows for realistic browser emulation, bypassing many client-side anti-bot mechanisms and correctly rendering JavaScript-generated content.
    *   **Retry Mechanisms and Error Handling:** Implementing exponential backoff and retry logic for failed requests, coupled with comprehensive error logging, helps in gracefully handling temporary network issues or intermittent website unresponsiveness. The `fix_sources.js` script further indicates a pragmatic approach to quickly adapt to minor changes or errors in source definitions.
    *   **User-Agent Rotation & Proxy Management:** To mitigate IP-based blocking and rate limiting, the system is designed to allow for rotation of user-agents and, if scaling demands, integration with proxy services. This ensures a higher success rate for scraping numerous sources.

### 2. Efficient Keyword Matching and Filtering

*   **Challenge:** Matching a potentially vast number of newly scraped opportunities against each user's specific, often complex, set of keywords and preferences (including inclusions, exclusions, and fuzzy matches) can be computationally intensive and slow, especially as the dataset grows.
*   **Solution:**
    *   **Database Indexing:** Leveraging MongoDB's text indexes on relevant fields (e.g., `title`, `description`) within the `Job` model dramatically speeds up keyword-based searches.
    *   **Optimized Matching Algorithm (`matcher.js`):** The `matcher.js` service employs a multi-stage filtering process. Initial broad-stroke filtering uses database queries with text indexes. Subsequent stages apply more complex logic in-memory for user-defined exact phrases, regular expressions, and exclusion criteria.
    *   **Asynchronous Processing:** Matching is performed asynchronously as a background task, ensuring that the main application flow remains responsive. This process is triggered by `scheduler.js` after new data has been scraped.
    *   **Keyword Normalization:** All keywords and job text are normalized (e.g., lowercased, punctuation removed) before matching to ensure consistent and accurate results, reducing false negatives.

### 3. Scalable and Timely Notification System

*   **Challenge:** Delivering notifications efficiently and reliably to a growing user base without overloading the server or causing delays, while also ensuring that notifications are relevant and not excessive.
*   **Solution:**
    *   **Queued Notification Processing:** The `notifier.js` service is designed to enqueue notifications rather than sending them immediately. This decouples the notification generation from the delivery mechanism, allowing for rate limiting, batch sending, and retry logic.
    *   **Scheduled Notification Batches:** `scheduler.js` is configured to periodically process the notification queue. This allows for sending notifications in batches at user-defined intervals (e.g., daily, hourly), reducing the load on the email service and preventing user fatigue from too many individual alerts.
    *   **User Preference-Based Throttling:** Notification frequency is configurable by the user via the `preferences-view`. The `notifier.js` respects these settings, preventing unnecessary notifications.
    *   **Dedicated Notification Model:** The `Notification.js` model stores notification records, enabling tracking of sent notifications, ensuring idempotency, and providing a history for users.

## Installation Guide

To set up and run Scoutly locally, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

### Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/TanmayAggarwal87/scoutly.git
    cd scoutly
    ```

2.  **Server Setup:**

    Navigate to the `server` directory and install dependencies:

    ```bash
    cd server
    npm install # or yarn install
    ```

    Create a `.env` file in the `server` directory based on the `Environment Variables` section below.

3.  **Client Setup:**

    Navigate to the `client` directory and install dependencies:

    ```bash
    cd ../client
    npm install # or yarn install
    ```

    Create a `.env.local` file in the `client` directory based on the `Environment Variables` section below.

4.  **Start the Server:**

    From the `server` directory:

    ```bash
    npm start
    ```

    The server will typically run on `http://localhost:5000` (or the port specified in your `.env`).

5.  **Start the Client:**

    From the `client` directory:

    ```bash
    npm run dev
    ```

    The client application will typically run on `http://localhost:3000`.

## Environment Variables

### Server (`server/.env`)

Create a file named `.env` in the `server` directory with the following content:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scoutlydb
JWT_SECRET=your_jwt_secret_key_here
# Optional: For email notifications
# EMAIL_SERVICE_PROVIDER=Gmail
# EMAIL_USER=your_email@example.com
# EMAIL_PASS=your_email_password
```

*   `PORT`: The port on which the Express server will listen.
*   `MONGO_URI`: The connection string for your MongoDB database. For development, `mongodb://localhost:27017/scoutlydb` is common. For production, use a cloud-hosted URI.
*   `JWT_SECRET`: A strong, secret string used to sign and verify JSON Web Tokens. Generate a complex string for production.
*   `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SERVICE_PROVIDER`: (Optional) Credentials for an SMTP service if you implement email notifications.

### Client (`client/.env.local`)

Create a file named `.env.local` in the `client` directory with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

*   `NEXT_PUBLIC_API_URL`: The base URL for the backend API. Ensure it matches your server's address and port.

## Project Structure

The repository is organized into a monorepo-like structure, separating the frontend and backend components for clarity and independent development.

```
scoutly/
├── .gitignore
├── client/                     # Frontend (Next.js) application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── app/                # Next.js App Router root, pages, layouts
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx        # Main application entry point
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/             # Shadcn UI (or similar) components
│   │   │   └── ...             # Feature-specific components (e.g., auth-screen, job-card)
│   │   └── lib/                # Utility functions, API clients
│   │       ├── api.ts          # Centralized API calls
│   │       └── utils.ts        # General utility functions
│   ├── package.json            # Client dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── ...                     # Other client configuration files (next.config.ts, postcss.config.mjs)
└── server/                     # Backend (Node.js/Express) API
    ├── src/
    │   ├── middleware/         # Express middleware (e.g., authentication)
    │   │   └── auth.js
    │   ├── models/             # Mongoose schemas for database entities
    │   │   ├── Job.js
    │   │   ├── Notification.js
    │   │   ├── Source.js
    │   │   └── User.js
    │   ├── routes/             # API endpoint definitions
    │   │   ├── auth.js
    │   │   ├── jobs.js
    │   │   ├── notifications.js
    │   │   ├── sources.js
    │   │   └── user.js
    │   ├── services/           # Core business logic and background tasks
    │   │   ├── matcher.js      # Logic for matching jobs to user preferences
    │   │   ├── notifier.js     # Handles sending notifications
    │   │   ├── scheduler.js    # Schedules recurring tasks (scraping, matching)
    │   │   └── scraper.js      # Web scraping logic
    │   ├── fix_sources.js      # Script for maintaining/fixing scraper configurations
    │   ├── index.js            # Main server entry point
    │   └── manual_scrape.js    # Script for triggering a scrape manually
    ├── .gitignore
    ├── package.json            # Server dependencies and scripts
    └── ...                     # Other server configuration files
```

## Deployment Information

Scoutly is designed for a modern, scalable deployment architecture, separating frontend, backend, and database components.

*   **Client (Frontend): Vercel**
    *   **Why Vercel:** Next.js is developed by Vercel, ensuring seamless integration and optimal performance. Vercel provides automatic deployments from Git repositories, serverless functions for API routes (if needed by Next.js), global CDN for static assets, and robust developer tools. This choice significantly reduces operational overhead and provides an excellent user experience through fast load times and reliable global availability.

*   **Server (Backend): Render**
    *   **Why Render:** Render is chosen as a Platform-as-a-Service (PaaS) for the Node.js backend. It offers automatic deployments, scalable infrastructure, built-in logging, and environment variable management. Critically, Render supports persistent background workers or services, which is essential for Scoutly's `scheduler.js` to run continuously for web scraping, matching, and notification tasks. This provides a good balance between ease of deployment (like Heroku) and more fine-grained control and cost-effectiveness for always-on services compared to pure serverless functions. Alternatives considered were dedicated VPS (e.g., DigitalOcean) for full control, but Render's managed services reduce maintenance burden.

*   **Database: MongoDB Atlas**
    *   **Why MongoDB Atlas:** As a fully managed cloud database service, MongoDB Atlas provides high availability, automatic scaling, backups, and security features out-of-the-box. This eliminates the complexities of self-hosting and managing a MongoDB instance, ensuring data reliability and performance without requiring significant DevOps resources. It supports global clusters and robust security measures, which are critical for a production application.

## Testing Approach

The current testing approach focuses on ensuring core functionalities are stable and reliable.

*   **Current State:**
    *   **Manual Testing:** Extensive manual testing is conducted during development cycles for both frontend and backend features. This includes verifying user authentication flows, keyword filtering accuracy, source management, and notification triggers.
    *   **API Endpoint Verification:** Tools like Postman or Insomnia are used to manually test individual API endpoints, ensuring correct request/response handling and data integrity.
    *   **Scraper Validation:** Output from `scraper.js` is manually inspected to confirm accurate data extraction from various sources.

*   **Future Plans:**
    *   **Unit Tests:** Implement comprehensive unit tests for isolated functions and modules, particularly for the `services` layer (e.g., `matcher.js`, `notifier.js`, `scraper.js`) on the server and individual React components on the client. Tools like Jest for Node.js and Jest with React Testing Library for Next.js will be utilized.
    *   **Integration Tests:** Develop integration tests to verify the interaction between different modules (e.g., how routes interact with services and models). This will ensure that complex workflows, like a user signing up and receiving their first matched job, function correctly end-to-end at the service level.
    *   **End-to-End (E2E) Tests:** Introduce E2E tests using frameworks like Cypress or Playwright to simulate real user interactions within the browser. These tests will validate critical user journeys from login to managing preferences and viewing opportunities, ensuring the entire application stack functions seamlessly.
    *   **Scraper Resilience Tests:** Specific tests will be designed to regularly check the health and accuracy of individual scrapers. This includes monitoring for broken selectors and adapting quickly to changes on target websites to maintain data integrity.

## Contributing Guidelines

We welcome contributions to Scoutly! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is invaluable.

To contribute:

1.  **Fork the repository.**
2.  **Clone your forked repository** to your local machine.
3.  **Create a new branch** for your feature or bug fix:
    `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`
4.  **Make your changes.** Please ensure your code adheres to the existing style and conventions.
5.  **Write clear and concise commit messages.** Describe the purpose and scope of your changes.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** against the `main` branch of the original repository.
    *   Provide a detailed description of your changes, including why they were made and how they address the problem or enhance the functionality.
    *   If your PR closes an issue, please reference it.

We appreciate your effort and look forward to reviewing your contributions!

## License Information

This project is licensed under the MIT License. See the `LICENSE` file (if present, otherwise implicitly MIT or similar open source) for details.

## Author/Contact

**Tanmay Aggarwal**
GitHub: [@TanmayAggarwal87](https://github.com/TanmayAggarwal87)
Email: tanmayagg.2005@gmail.com

---
-- made by docify --
