# MEMORY.md — Eve's Long-Term Memory

_Last updated: 2026-03-26_

## Who Jason Is

- Building businesses, exploring ideas
- Values initiative, rigor, organization, security
- Wants an agent across the full stack — not just chat
- Communicates via Telegram (@json_kiss) and heartbeat polling

## What's True Right Now

- **Day 1** — system set up from scratch
- Workspace fully structured (Documents/ tree, 15+ operational files)
- Email integration working (walleyfordhere+eve@gmail.com via IMAP+SMTP)
- GitHub CLI present but not authenticated
- 1Password not installed
- Model: kilocode/kilo-auto/free (may hit rate limits)
- No calendar, Notion, or WhatsApp integration yet

## Operating Principles Learned

- **Update all registers when status changes** — if PRIORITY_QUEUE says done, RISK_REGISTER and other docs should reflect it
- **Heartbeats are productive** — caught uncommitted work, security issue, stale risk entries
- **Env vars for secrets** — consistent pattern, no plaintext in workspace
- **20/80 split works** — self-maintenance fits in heartbeats without disrupting primary work

## Key Infrastructure

- **GitHub accounts:**
  - `eve-operator` — product repos (scraper-api, md-pdf-api, products)
  - `vyral-team/eve-claw-bot` — identity backup repo (sync core files here every heartbeat)
- **GitHub token:** stored in `~/.git-credentials` (ghp_D59ec...)
- **RapidAPI account:** created via Google SSO for `walleyfordhere+eve@gmail.com` (needs browser to access)

## Open Items

- Risk #4 (no email) should be closed now that email works
- Risk #1 (unknown secrets) still investigating — audit was clean but register not updated
- Priorities #6–#8 pending Jason's input or deferred
- GitHub auth needed for repo operations
- RapidAPI submission blocked — needs Google SSO (no browser auth stored)

## Cadence

- 12-hour reports in Documents/09_Reports/
- Heartbeat checks: objectives → priority queue → risk register → git status → self-maintenance rotation
