# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)
- Update the directive with what you learned (API limits, timing, edge cases)
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access
- **Intermediates**: Temporary files needed during processing

**Directory structure:**
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.
- `execution/` - Python scripts (the deterministic tools)
- `directives/` - SOPs in Markdown (the instruction set)
- `.env` - Environment variables and API keys
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.

# REDFLAGS — PRODUCT BIBLE

## CORE PRINCIPLE
Capture what was said. Reveal what it might mean.

REDFLAGS is a real-time dating signal interpreter that converts fragmented user input into structured insights, risk signals, and actionable follow-ups.

Risk is not permanent. It updates with new information.

---

## PRODUCT OVERVIEW

### Name
REDFLAGS

### Platforms
- iOS (Primary)
- Android (Secondary)
- Web (Admin / Landing)

---

## DESIGN PRINCIPLE

### Visual Identity
- Black and white base UI
- ALL color reserved for signals (flags only)

### Goal
Color = meaning

---

## COLOR SYSTEM

🟢 #22C55E — Safe  
🟡 #EAB308 — Caution  
🟠 #F97316 — Warning  

Escalation:
- #F25C2A  
- #F04438  
- #E53935  
- #D32F2F  

🔴 #EF4444 — Max Risk  

---

## SCORING SYSTEM


Recent boost:
weight = base * 1.3

---

## MONETIZATION

### Free Trial
- 3 days

### Core
- $2.99/week
- $29.99/year

### Pro
- $9.99/month
- $45.99/year

---

## PAYWALL SYSTEM

### Core
Don’t second guess what you already felt.

### Pro
Now let’s break it down.

---

## ONBOARDING

1. You already see the signs  
2. Capture the moment  
3. Know before you go back  
4. Paywall  

---

## FIREBASE ARCHITECTURE

- Auth
- Firestore
- Functions
- Storage

---

## BUILD ORDER

1. colors.ts  
2. scoring engine  
3. live input screen  
4. color transition system  
5. Firebase functions  
6. paywall  
7. reports  

---

## FINAL POSITIONING

REDFLAGS is not a dating app.

It is a real-time emotional intelligence tool.

---

## AUTHENTICATION

### Provider
Firebase Authentication

### Methods
- Sign in with Apple
- Email and password
- Optional anonymous guest mode for onboarding/MVP trial flow

### Rules
- Guest users can test the app
- Account required for saving sessions, reports, subscriptions, and sync
- Anonymous accounts can be upgraded into permanent accounts

### Why
- Low-friction onboarding
- Easy App Store support
- Clean integration with Firestore and subscriptions
- Strong fit for a private, emotionally sensitive product

## PERSONALIZATION LAYER

### Core Principle
REDFLAGS should not treat every trait as universally good or bad.
The system should interpret signals through the user’s stated relationship goals, standards, and dealbreakers.

### Purpose
This keeps the user honest about what they want and allows the app to generate more accurate, personalized insights.

### Profile Setup
After signup, each user creates a Relationship Lens profile.

### Relationship Lens includes:
- who they are
- who they date
- relationship goals
- monogamy vs non-monogamy preference
- desire for children
- openness to partners with children
- financial stability importance
- ambition importance
- lifestyle preferences
- hard dealbreakers
- soft concerns

### AI Interpretation Layers
1. Universal caution signals
2. Personal mismatch signals
3. Personal match signals
4. Contextual offsets

### Output Types
- Red Flag
- Yellow Flag
- Green Flag
- Personal Mismatch
- Personal Match
- Needs Clarification

### Product Rule
A trait should not be labeled a red flag unless it is:
- broadly concerning across contexts, or
- directly inconsistent with the user’s stated preferences

## FINAL TRUTH

REDFLAGS is a second brain for dating.
