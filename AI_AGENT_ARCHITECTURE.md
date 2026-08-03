# AI Agent Architecture

To ensure high quality, modularity, and easy debugging, the AI generation process is broken down into a multi-agent system. Instead of asking one monolithic LLM prompt to "research a company and write an email," we use a pipeline of specialized, narrow-scoped agents.

---

## 1. Research Agent (The Gatherer)
Responsible for fetching raw data about the target company from the web and third-party APIs.
- **Input:** Target Company Name, Company Domain URL.
- **Output:** Cleaned text blocks (Homepage content, "About Us" content, latest 3 news articles/blog posts).
- **Prompt:** (Hybrid approach) Uses headless browsers/scraping APIs first. If HTML needs cleaning: *"Extract the main readable text from the following HTML, ignoring navigation menus, footers, and cookie banners."*
- **Memory:** Ephemeral. Passed directly to the Analysis Agent and then discarded to save database storage.
- **Failure Handling:** If scraping times out or encounters a CAPTCHA, immediately fallback to querying a firmographic API (e.g., Clearbit/Apollo) for a company description.
- **Retries:** 2 retries with exponential backoff for HTTP timeouts.
- **Confidence Scoring:** Boolean (100% if > 500 characters of readable text extracted, 0% if extraction fails).

---

## 2. Company Analysis Agent (The Analyst)
Synthesizes the raw data gathered by the Research Agent into structured insights.
- **Input:** Cleaned text blocks from the Research Agent.
- **Output:** Strict JSON containing: `value_proposition`, `target_audience`, `recent_milestone`.
- **Prompt:** *"You are an elite B2B analyst. Read the following raw company data. Extract their core value proposition, their primary target audience, and one recent news event or milestone. If no milestone is found, return null for that field. You must output strictly in valid JSON format matching this schema..."*
- **Memory:** Stored persistently in the `ai_insights` table (Type: `COMPANY_SUMMARY`). Reused for future users targeting the same company.
- **Failure Handling:** If the LLM returns malformed JSON, catch the parsing error and re-prompt the LLM, passing the malformed output and instructing it to fix the JSON syntax.
- **Retries:** 1 retry for JSON formatting errors. If it fails twice, fallback to a basic rule-based text extraction.
- **Confidence Scoring:** 
  - **High (90%+):** All three JSON keys are populated with specific, non-generic details.
  - **Low (<50%):** The `recent_milestone` is null, or the `value_proposition` is overly generic (e.g., "They sell software").

---

## 3. Decision Maker Agent (The Matcher)
Finds the right person to contact based on the user's desired persona.
- **Input:** Company Name/Domain, User's Desired Persona (e.g., "VP of Marketing" or "CTO").
- **Output:** Decision Maker Name, Exact Title, LinkedIn URL.
- **Prompt:** Largely API-driven (searching employee databases). However, if an API returns 10 potential employees, the LLM is used to filter: *"Given the user wants to reach the 'Head of Marketing', review this list of 10 employees and their titles. Return the ID of the person who best matches this persona."*
- **Memory:** Ephemeral (creates a record in the `contacts` table if successful).
- **Failure Handling:** If no exact match is found for a narrow persona (e.g., "VP of Performance Marketing"), broaden the search query automatically to "Marketing" and return the most senior person available.
- **Retries:** 2 retries if the employee database API returns a 429 (Rate Limit) or 5xx error.
- **Confidence Scoring:** 
  - **100%:** Exact title match (e.g., requested "CMO", found "Chief Marketing Officer").
  - **70%:** Department/Seniority match (e.g., requested "CMO", found "VP of Marketing").
  - **30%:** Fallback match (e.g., requested "CMO", found "Marketing Manager").

---

## 4. Contact Discovery Agent (The Verifier)
Retrieves and verifies the email address of the matched Decision Maker.
- **Input:** Decision Maker Name, Company Domain.
- **Output:** Email Address, Verification Status.
- **Prompt:** N/A. This is a purely deterministic/API-driven agent integrating with providers like Hunter, Dropcontact, or Apollo.
- **Memory:** Stored securely in the `contacts` table.
- **Failure Handling:** **Waterfall Logic.** Try Provider A. If Provider A returns 'Not Found' or 'Catch-all', try Provider B. 
- **Retries:** No time-based retries on 'Not Found', but sequential retries across a maximum of 3 different data providers.
- **Confidence Scoring:** Provided directly by the SMTP handshake verification:
  - **Verified (99%):** Safe to send.
  - **Catch-all (50%):** Risky, requires user opt-in to export.
  - **Unverified/Guessed (10%):** Not exported by default.

---

## 5. Outreach Writer Agent (The Copywriter)
The final agent that synthesizes all context to draft the personalized email.
- **Input:** 
  1. Company Analysis JSON (from Agent 2)
  2. Decision Maker Name & Title (from Agent 3)
  3. User's Value Proposition (from User Profile)
- **Output:** Email Subject Line, Email Body.
- **Prompt:** *"You are an elite B2B SDR known for concise, highly relevant cold emails. Write a cold email to {DM_Name}, {DM_Title} at {Company_Name}. 
  Context to use as the 'hook': {recent_milestone} or {value_proposition}. 
  Our offering: {User_Value_Prop}. 
  Rules: Maximum 75 words. Tone must be professional and direct. Do not use generic greetings like 'I hope this finds you well'. End with a soft, low-friction call to action."*
- **Memory:** Stored in the `ai_insights` table (Type: `EMAIL_DRAFT`) and linked to the user's specific Lead List.
- **Failure Handling:** Output validation rules. If the output string contains banned generic phrases ("In today's fast-paced world"), or exceeds 100 words, trigger a regeneration.
- **Retries:** Max 2 regenerations based on failing the validation rules. If it fails 3 times, return the best effort and flag for user review.
- **Confidence Scoring:** Rules-engine based (post-generation check).
  - **+20 pts:** Word count between 30-75 words.
  - **+30 pts:** Successfully included the `{recent_milestone}` string.
  - **-50 pts:** Contains banned generic phrasing.
  - *Drafts scoring below 50 are flagged in the UI for mandatory manual editing before export.*
