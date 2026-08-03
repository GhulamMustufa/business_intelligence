# System Architecture

## 1. Architectural Philosophy: Modular Monolith
The backend will be built as a **Modular Monolith** using NestJS. This provides the development speed and simplicity of a single deployable unit for the MVP, while strictly enforcing domain boundaries (bounded contexts). If a specific module (e.g., the AI Generation Engine) requires independent scaling in the future, it can be easily extracted into a separate microservice.

## 2. Technology Stack
- **Frontend:** Next.js 15 (React App Router)
- **Backend API:** NestJS 11 (Node.js/TypeScript)
- **Primary Database:** PostgreSQL (Relational data, user accounts, leads)
- **In-Memory Store & Caching:** Redis
- **Message Queue / Jobs:** BullMQ (built on top of Redis)
- **Containerization:** Docker
- **Cloud Provider:** AWS (Amazon Web Services)

## 3. System Diagram

```mermaid
architecture-beta
    group client(Client)
    service browser(Browser) in client
    
    group web(Frontend - Next.js)
    service nextapp(Next.js App) in web
    
    group backend(Backend - Modular Monolith)
    service nestapi(NestJS API) in backend
    service nestworker(NestJS Workers) in backend
    
    group data(Data Layer)
    service pg(PostgreSQL) in data
    service redis(Redis & BullMQ) in data
    
    group external(External Integrations)
    service llm(OpenAI/Anthropic) in external
    service enrichment(Apollo/Hunter API) in external
    service payment(Stripe) in external

    browser:R --> L:nextapp
    nextapp:R --> L:nestapi
    nestapi:B --> T:pg
    nestapi:R --> L:redis
    redis:R --> L:nestworker
    nestworker:B --> T:pg
    nestworker:R --> L:llm
    nestworker:R --> L:enrichment
    nestapi:T --> B:payment
```

## 4. Bounded Contexts (Modules)
The NestJS application will be divided into the following strict modules:
- **Auth Module:** Registration, Login, JWT/Sessions.
- **Billing Module:** Stripe integration, Credit ledger.
- **Company Module:** Company search and firmographic data management.
- **Enrichment Module:** Contact discovery and verification.
- **AI Generation Module:** Web scraping, LLM prompt orchestration, draft generation.
- **Campaign Module:** Grouping generated leads and managing CSV exports.

## 5. Data Flow (Example: AI Email Generation)
Because AI generation and web scraping are slow processes, they cannot be handled synchronously in an HTTP request.
1. **Request:** Next.js sends a `POST /generate` request with a target company/contact.
2. **API Layer:** NestJS receives the request, validates credits via the Billing Module, and creates a "Draft" record in PostgreSQL with status `PENDING`.
3. **Queueing:** NestJS pushes a job to BullMQ (Redis) containing the Draft ID and required context. NestJS responds to Next.js with `202 Accepted` and the Draft ID.
4. **Processing (Background Job):** A NestJS Worker process picks up the job from BullMQ.
   - It scrapes the company website.
   - It calls the Contact Enrichment API.
   - It calls the LLM (e.g., OpenAI) with the synthesized prompt.
5. **Completion:** The worker updates the Draft record in PostgreSQL to `COMPLETED` and saves the generated text.
6. **Client Notification:** The Next.js frontend, which has been polling (or connected via WebSockets) for the Draft ID, sees the `COMPLETED` status and updates the UI.

## 6. Caching Strategy (Redis)
- **External API Responses:** Cache expensive or heavily rate-limited third-party API calls (like Company Firmographics) for 24-48 hours. If multiple users search for the same company, we don't pay the API provider twice.
- **Rate Limiting:** Implement strict IP and User-level rate limiting on the NestJS API to prevent abuse.
- **Session Management:** If using stateful sessions (over JWTs), Redis will store session tokens for fast validation.

## 7. Queues & Background Jobs (BullMQ)
BullMQ is critical for the system's stability. 
- **Retry Mechanisms:** If an external API (like an LLM) times out, BullMQ handles exponential backoff and retries.
- **Concurrency Control:** We can limit the number of active workers calling a specific 3rd-party API to avoid hitting rate limits.
- **Scheduled Jobs:** Used for daily credit resets, subscription renewals, or background database cleanup.

## 8. Security
- **Authentication:** NextAuth (Frontend) paired with JWTs or HttpOnly Session Cookies validated by NestJS.
- **Data Protection:** PostgreSQL must be secured inside a private VPC. Passwords hashed via bcrypt/Argon2. 
- **Secrets Management:** AWS Secrets Manager or AWS Systems Manager Parameter Store for database credentials and API keys.
- **Encryption:** TLS/HTTPS for all in-transit data. AWS KMS for encryption at rest (RDS).

## 9. Logging & Monitoring
- **Application Logging:** Use `pino` or `winston` in NestJS. Output logs in structured JSON format.
- **Error Tracking:** Sentry integrated into both Next.js and NestJS to catch unhandled exceptions and promise rejections.
- **Infrastructure Monitoring:** AWS CloudWatch for container CPU/Memory metrics and database health.
- **Queue Monitoring:** BullMQ has a dedicated UI dashboard (Bull-Board) to monitor failed, active, and delayed jobs.

## 10. Scalability (AWS Architecture)
- **Compute:** The NestJS Monolith and Next.js frontend are containerized with Docker. Deployed on **AWS ECS (Fargate)** for serverless container management.
- **Auto-Scaling:** ECS can auto-scale the API containers based on CPU/Memory, and auto-scale the Worker containers based on the **depth of the BullMQ queue**.
- **Database:** Amazon RDS for PostgreSQL. Start with a single instance, ready to add Read Replicas as query volume grows.
- **Load Balancing:** AWS Application Load Balancer (ALB) routes traffic to the Next.js and NestJS containers.
