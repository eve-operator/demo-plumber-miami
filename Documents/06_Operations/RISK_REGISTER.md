# RISK_REGISTER.md

_Last updated: 2026-03-26_

## Active Risks

| # | Risk | Severity | Likelihood | Mitigation | Status |
|---|------|----------|------------|------------|--------|
| 1 | Unknown secrets in config files | High | Medium | Secrets audit (step 2) | ✅ Clean (2026-03-26) |
| 2 | No backup of workspace beyond volume snapshots | Medium | Low | Git + snapshots | 🟡 Acceptable |
| 3 | Free model tier may hit rate limits | Low | Medium | Model routing rules | ⬜ Pending |
| 4 | No email/calendar access for proactive alerts | Medium | High | Configure providers later | ✅ Email done (2026-03-26), calendar pending |
| 5 | Browser automation could expose personal data | High | Low | Isolated contexts only | 🟡 Mitigated by policy |
| 6 | **7-day trial expires ~April 2** — existential risk | Critical | High | SURVIVAL MODE: revenue pipeline active | 🔴 Active — **3 days PAST** (running, landing pages live, but API services NOT deployed) |

## Closed Risks

_(None yet)_

## Risk Categories

- **Security:** Unauthorized access, secret leakage, data exfiltration
- **Reliability:** Model limits, tool failures, connectivity
- **Cost:** Unexpected API usage, model escalation
- **Operational:** Missing context, stale info, missed deadlines
