# API Integrations Strategy

This document outlines the external APIs required to power the AI and data enrichment engines, including strategies for handling rate limits, caching, and fallbacks.

---

## 1. OpenAI (Primary LLM)
Used for the **Company Analysis Agent** and **Outreach Writer Agent**.
- **Authentication:** Bearer Token (API Key stored securely in AWS Secrets Manager).
- **Rate Limits:** Bound by usage tiers (e.g., Tier 4: 10,000 RPM / 2M TPM).
- **Fallback:** If OpenAI returns a 500 or repeated 429s, the system automatically falls back to **Anthropic Claude 3.5 Sonnet**.
- **Caching:** Cache exact prompt hashes. If the exact same Company Context and User Value Prop are used again within 7 days, return the cached AI draft from PostgreSQL instead of making a new API call.
- **Retry Strategy:** Exponential backoff via BullMQ. On a `429 Too Many Requests`, pause the worker for 5 seconds, then 10 seconds, then fail after 3 attempts.

---

## 2. Anthropic (Secondary / Alternative LLM)
Used as a fallback for OpenAI, or as the primary model if user preference dictates (some users prefer Claude for copywriting).
- **Authentication:** `x-api-key` header.
- **Rate Limits:** Tiered based on pre-funded credits.
- **Fallback:** Fallback to OpenAI GPT-4o.
- **Caching:** Same as OpenAI. Cache exact prompt hashes for 7 days.
- **Retry Strategy:** Exponential backoff on `429` or `529` (Overloaded) errors. Max 3 retries.

---

## 3. Company Data Providers (e.g., Apollo, Clearbit, or ZoomInfo)
Used by the **Research Agent** for fetching firmographic data (headcount, industry, location).
- **Authentication:** API Key via HTTP Headers.
- **Rate Limits:** Often strict (e.g., 600 requests per minute depending on the plan).
- **Fallback:** Waterfall approach. If Apollo fails, try Clearbit. If both fail, fallback to a raw Google Search + basic website scraping.
- **Caching:** **Aggressive Caching.** Company firmographics change slowly. Cache responses in PostgreSQL (`companies` table) for 30-90 days to minimize expensive API calls across all users.
- **Retry Strategy:** Retry immediately on `5xx` server errors (max 2 times). Do NOT retry on `404` (Company Not Found) or `422` (Unprocessable Entity)—immediately trigger the fallback provider.

---

## 4. Email Verification Providers (e.g., Hunter, Dropcontact, NeverBounce)
Used by the **Contact Discovery Agent** to guess and verify decision-maker emails.
- **Authentication:** API Key (usually in Query Params or Headers).
- **Rate Limits:** Typically bound by monthly limits rather than strict per-second concurrency, but we will artificially limit concurrency to 50 concurrent requests.
- **Fallback:** **Strict Waterfall.** No single provider has 100% coverage. 
  1. Try Provider A (Dropcontact). 
  2. If 'Not Found', try Provider B (Hunter).
  3. If 'Not Found', try Provider C (Apollo).
- **Caching:** **Permanent.** Once an email is marked as 'Verified', cache it indefinitely in the `contacts` table. Never re-verify unless explicitly requested by the user, saving massive API costs.
- **Retry Strategy:** Retry `5xx` errors twice. If `404` or 'Unknown', immediately trigger the fallback waterfall.

---

## 5. LinkedIn (Manual/Import Only)
LinkedIn strictly prohibits automated scraping. Therefore, we do not integrate directly with their API for automated discovery.
- **Authentication:** N/A (User relies on their own LinkedIn session externally).
- **Rate Limits:** N/A.
- **Fallback:** N/A.
- **Caching:** Store imported CSV data (from Sales Navigator exports) in the `companies` and `contacts` tables.
- **Retry Strategy:** If the user uploads a malformed CSV, reject the row and return clear validation errors to the UI.

---

## 6. Google Search (e.g., Serper.dev, SerpAPI, or Google Custom Search)
Used by the **Research Agent** to find recent company news, press releases, or find the correct LinkedIn URL for a specific person.
- **Authentication:** API Key.
- **Rate Limits:** Generous (e.g., 100 QPS on Serper.dev).
- **Fallback:** If Serper.dev is down, fallback to Bing Search API or DuckDuckGo HTML scraping.
- **Caching:** Cache search queries (e.g., `"Acme Corp" "news"`) for 24 to 48 hours in Redis. News older than 48 hours is acceptable for MVP email context.
- **Retry Strategy:** Standard exponential backoff up to 3 times on `5xx` or `429` errors.

---

## 7. RSS Feeds
Used by the **Research Agent** as a lightweight, free alternative to find recent company milestones (if a company publishes an RSS feed on their blog).
- **Authentication:** None (Public XML feeds).
- **Rate Limits:** Implicit. We must be polite to target company servers. Do not poll a specific domain's RSS feed more than once every 6 hours.
- **Fallback:** If an RSS feed doesn't exist, is invalid XML, or connection times out, seamlessly fallback to Google Search (News tab) or scraping the raw HTML of their `/blog` page.
- **Caching:** Parse the XML and cache the resulting articles in PostgreSQL for 12 hours.
- **Retry Strategy:** If connection times out (e.g., target server is slow), wait 5 seconds and try once more. If it fails again, abort and trigger the Google Search fallback.
