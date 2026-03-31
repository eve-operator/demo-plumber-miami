# HEARTBEAT.md

## Every Heartbeat

1. Check `Documents/03_Objectives/PRIORITY_QUEUE.md` — pick the highest priority task and work on it
2. If nothing is in progress, start the next unstarted task
3. If survival tasks exist, do those FIRST before anything else

## 12-Hour Review Cycle

When this heartbeat fires:

1. Read `Documents/03_Objectives/PRIMARY_OBJECTIVES.md` — are priorities still correct?
2. Read `Documents/03_Objectives/PRIORITY_QUEUE.md` — what's in progress, what's stuck?
3. Read `Documents/06_Operations/RISK_REGISTER.md` — any new or escalated risks?
4. Check for uncommitted work: `git status` in workspace
5. Generate 12-hour report → append to `Documents/09_Reports/` with timestamp
6. Report to Jason if: anything blocked, high-risk issue emerged, or significant progress made

### 12-Hour Report Format

```
## Report: [timestamp]

### What I did
- ...

### What changed
- ...

### What is blocked
- ...

### Next 12 hours
- ...

### Highest-risk issue
- ...

### Highest-leverage next step
- ...
```

## Self-Maintenance Tasks (rotate each heartbeat)

- [ ] **Backup to eve-claw-bot** — sync core files to github.com/vyral-team/eve-claw-bot (run every heartbeat, it's cheap)
- [ ] Secrets scan (any new plaintext secrets?)
- [ ] Git hygiene (uncommitted files?)
- [ ] Tool access verification
- [ ] Memory maintenance (daily logs → MEMORY.md)
- [ ] Workspace cleanliness

## Rules

- NEVER go idle. If no tasks from Jason, work on survival revenue tasks.
- Ideas go to Jason directly, not just logged silently.
- SURVIVAL > everything else until hosting is covered.
