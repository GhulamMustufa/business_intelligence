# LeadForge AI: Coding Standards & Best Practices

This document outlines the coding standards, architectural principles, and best practices expected across the LeadForge AI codebase. It serves as a guide to maintain a production-grade, maintainable, and scalable application while keeping the MVP fast to develop.

## 1. Core Engineering Principles
- **DRY (Don't Repeat Yourself):** Abstract shared logic into reusable utilities or services.
- **KISS (Keep It Simple, Stupid):** Avoid premature optimization. Write readable code over "clever" one-liners.
- **YAGNI (You Aren't Gonna Need It):** Do not build features or abstractions for hypothetical future use cases.
- **SOLID Principles:** 
  - **S**ingle Responsibility: A class/function should do one thing. If a function is > 50 lines, split it.
  - **O**pen/Closed: Open for extension, closed for modification.
  - **L**iskov Substitution: Subtypes must be substitutable for base types.
  - **I**nterface Segregation: Keep interfaces small and focused.
  - **D**ependency Inversion: Depend on abstractions, not concretions (heavily utilized via NestJS DI).

## 2. Code Quality & Formatting
- **Readability over Cleverness:** Avoid deep nesting (max 3 levels). Use early returns. Avoid duplicate logic.
- **Prettier & ESLint:** All code must pass linting and formatting checks in CI/CD. Configure VSCode to format on save.
- **Code Comments (Focus on WHY, not WHAT):** 
  - Add comments ONLY when: logic is not immediately obvious, there is a strict business rule, there is a workaround/hack, or complex database queries.
  - ❌ Bad: `// increment counter \n count++;`
  - ✅ Good: `// We increment here to account for the zero-indexed API response`

## 3. TypeScript Standards
- **Strict Mode:** Always ensure `"strict": true` in `tsconfig.json`.
- **Avoid `any`:** Never use `any`. Use `unknown` if the type is truly dynamic, and narrow it down via type guards.
- **Separate Types:** Keep types separate (e.g., `types/user.types.ts`). Do NOT inline large types inside components.
- **Shared Types:** Where possible, share types between the frontend and backend (API response types, common DTOs) to maintain a consistent contract.
- **Interfaces vs. Types:** Use `interface` for object shapes and class contracts. Use `type` for unions and intersections.

## 4. Frontend (Next.js 15 App Router) Best Practices
- **Server Components First:** Use Server Components by default to reduce client-side JS. Only use `"use client"` when strictly needed (`useState`, `useEffect`, event handlers).
- **Avoid Unnecessary Re-renders:** Do NOT wrap everything in `useState` or overuse `useEffect`. Keep state as local as possible.
- **State Management:** Keep state minimal. Do NOT add global stores (Redux/Zustand) unless absolutely required for the MVP.
- **Component Splitting:** Break UI into page components, layout components, reusable common components (`components/ui/`), and feature-specific components (`features/`).
- **Hooks Separation:** Do NOT put API logic inside components. Use custom hooks (`useAuth()`, `useSearch()`) for API calls and complex reusable logic.
- **Prop Drilling:** If props go deeper than 2-3 levels, use context or move the state to a feature-level hook.
- **Performance:** Optimize images using `next/image` and avoid unnecessary client hydration on static sections.

## 5. Backend (NestJS 11) Best Practices
- **Layered Architecture:** Always follow: Controller → Service → Repository (Prisma).
- **No Business Logic in Controllers:** Controllers must ONLY receive the request, call the service, and return the response.
- **Fat Services, Skinny Controllers:** All business logic lives in the Service layer.
- **Keep APIs Simple:** One endpoint = one purpose. Avoid multi-purpose endpoints.
- **Pagination is Mandatory:** All list APIs must support `limit` and `offset`/`cursor`.
- **Avoid Overfetching:** Return only required fields in API responses.
- **DTOs:** Always use classes with `class-validator` to validate incoming requests.

## 6. Database & Data Modeling (PostgreSQL + Prisma)
- **Avoid Heavy Joins:** Keep queries simple. Denormalize only when absolutely necessary for performance.
- **Avoid N+1 Queries:** Batch fetch where possible and use Prisma's `include` carefully.
- **Indexing:** Ensure foreign keys and heavily queried fields (e.g., `email`, `domain`, `created_at`) have appropriate indexes.
- **Migrations:** Never modify the schema directly. Always use Prisma migrations.
- **UUIDs & Soft Deletes:** Use UUIDs for primary keys. Use `deletedAt` for soft deleting critical records (Users, Organizations).

## 7. What NOT to Optimize in the MVP
If an optimization makes the code harder to read, do NOT do it yet. 
- ❌ Do NOT `memo()` or `useCallback()` everywhere prematurely.
- ❌ Do NOT build complex caching layers on day 1 (unless hitting strict API limits).
- ❌ Do NOT over-engineer microservices; stick to the Modular Monolith.
- ❌ Do NOT implement GraphQL unless strictly needed (REST is fine).
- **MVP Priority:** Correctness > Simplicity > Maintainability > Speed of Development.

## 8. Error Handling & Security
- **Do not swallow errors:** Avoid empty `catch` blocks.
- **Structured Logging:** Use a structured logger (`pino`/`winston`) in NestJS.
- **Graceful Degradation:** Use `error.tsx` boundaries in Next.js.
- **Authentication/Authorization:** Use JWTs, implement RBAC, and secure `.env` variables. Always sanitize input.

## 9. Version Control (Git Workflow)
- **Branch Naming:** `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
- **Commit Messages:** Follow Conventional Commits (e.g., `feat: add Google OAuth login`).
- **Pull Requests:** Keep PRs small and focused on a single logical change.
