# Product Requirements Document (PRD)

## 1. Functional Requirements
- **User Authentication:** Users must be able to sign up and log in (Email/Password or OAuth).
- **Profile & ICP Configuration:** Users must be able to define their own Value Proposition and their Ideal Customer Profile (ICP) criteria (e.g., industry, company size, location).
- **Company Discovery:** The system must allow users to search for and view lists of companies matching their ICP.
- **Company Analysis:** The system must use AI to analyze a selected company (scraping website, reading recent news, extracting core business models).
- **Contact Identification:** Users must be able to specify a target persona (e.g., "VP of Sales"), and the system must identify individuals matching that persona at the target company.
- **Data Enrichment:** The system must retrieve verified contact information (primarily email) for the identified decision-maker.
- **AI Copy Generation:** The system must generate highly personalized email drafts by synthesizing the user's Value Proposition, the Company Analysis, and the specific Decision Maker's profile.
- **Export Functionality:** Users must be able to export selected leads and generated copy to a CSV file.
- **Credit Tracking:** The system must track user actions (searches, AI generations, enrichments) and deduct from a monthly credit balance.

## 2. Non-functional Requirements
- **Performance:** 
  - UI interactions should feel instantaneous (< 200ms).
  - AI generation for a single email draft should complete in < 5 seconds.
  - Bulk processing must be handled asynchronously to prevent UI blocking.
- **Scalability:** The architecture must support third-party API rate limits (LLMs, data enrichment providers) via robust queuing and retry mechanisms.
- **Security & Privacy:** 
  - User data and custom prompts must be securely isolated.
  - The platform must not store raw contact data longer than necessary, relying on compliant third-party data providers where possible to adhere to GDPR/CCPA.
- **Usability:** The interface must strictly guide the user through a linear step-by-step workflow to minimize context switching.

## 3. Acceptance Criteria (End-to-End Core Loop)
- **Given** a user is logged in and has defined their Value Proposition,
- **When** they search for "E-commerce companies in New York",
- **Then** they should see a list of relevant companies.
- **When** they select a company and ask to find the "CMO",
- **Then** the system should return a name and a verified email address.
- **When** they click "Generate Outreach",
- **Then** the system produces an email draft that accurately references the target company's business model or recent news, without generic AI hallucinations.
- **When** they click "Export",
- **Then** a CSV downloads containing the company name, contact name, email, and the generated text.

## 4. Success Metrics
- **Activation Rate:** The percentage of new sign-ups who successfully generate their first AI email draft within 24 hours.
- **Time-to-Value (TTV):** The average time elapsed between a user signing up and exporting their first batch of leads. Target: < 5 minutes.
- **Credit Utilization:** The average percentage of monthly credits utilized by paying users. High utilization indicates the tool is embedded in their daily workflow.
- **Month 1 Retention Rate:** The percentage of users who remain active (or remain subscribed) into their second month.

## 5. MVP Features
- User Auth & Billing (Stripe integration).
- Centralized Dashboard for usage tracking.
- Step 1: ICP and Value Proposition setup wizard.
- Step 2: Company Discovery Search UI.
- Step 3: Automated Company Research Agent (Web scraper + LLM summarization).
- Step 4: Contact Discovery integration (API connection to Apollo/Hunter/similar).
- Step 5: AI Email Drafter (Prompt orchestration using OpenAI/Anthropic).
- CSV Export Module.

## 6. Out-of-Scope Features (MVP)
- ❌ Direct email sending via SMTP/IMAP (No native inbox).
- ❌ Email Sequencing (No follow-up steps 2, 3, etc.).
- ❌ Native CRM Integrations (No bi-directional sync with Salesforce/HubSpot).
- ❌ Intent Data Tracking (No "who is searching for you right now" alerts).
- ❌ Multi-channel Orchestration (No automated LinkedIn connection requests or Twitter DMs).
- ❌ Team Collaboration/Workspaces (Single-player mode only for MVP).
- ❌ Chrome Extension (Web app only).

## 7. Subscription Ideas
*Pricing is based on "Credits" which represent expensive actions (e.g., revealing an email + generating an AI draft).*
- **Free Tier / Trial:** 10 Credits. Enough to experience the "Aha!" moment and see the quality of the AI generation.
- **Starter ($49/mo):** 500 Credits. Designed for freelancers and solopreneurs doing targeted daily outreach.
- **Pro ($99/mo):** 2,000 Credits + Bulk Processing. Designed for boutique agencies and founders building larger pipelines.
- **Agency ($299/mo):** 10,000 Credits. For teams doing volume outreach on behalf of clients.

## 8. Future Features (Post-MVP)
- **Direct Sending:** Integrating Google/Outlook APIs to send emails directly from the platform.
- **CRM Sync:** Push leads and activity logs directly to HubSpot or Salesforce.
- **Custom Prompts & Voices:** Allowing users to train the AI on their past successful emails to mimic their exact tone of voice.
- **LinkedIn Automation:** Generating connection requests and personalized DMs.
- **Chrome Extension:** Enabling the AI research and contact-finding engine over any LinkedIn profile or company website.
- **Webhook / Zapier Support:** Allowing users to trigger outreach generation from their own external tools.
