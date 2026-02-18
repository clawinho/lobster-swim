# Automated Development Workflow

This document defines the automated gamedev cycle for Lobster Swim. It is designed to be ingested by any AI orchestrator (OpenClaw, Claude Code, etc.) and converted into a scheduled job.

## Schedule

- **Frequency:** Every 1 hour
- **Timeout:** 10 minutes max per run
- **Report to:** Telegram group (or stdout if no messaging available)

## Environment

- **Repository:** The canonical repo on the machine serving the game
- **Branch:** main

## File Locations

| File | Path | Description |
|------|------|-------------|
| SUGGESTIONS.md | repo root | Shared inbox — humans and agents both contribute here |
| TODO.md | agents/TODO.md | Active task list managed by Producer role |
| BLOCKERS.md | agents/BLOCKERS.md | Blocker tracking across all roles |
| GAMEDEV_ROLES.md | agents/GAMEDEV_ROLES.md | Index of all available roles |
| Role definitions | agents/roles/*.md | Individual role prompts and responsibilities |
| PRACTICES.md | repo root | Development rules — law of the land |
| GAME_VISION.md | repo root | North star design document |
| STAGES.md | repo root | Detailed level/stage designs |
| CLAUDE.md | repo root | Project onboarding context |

**Never create duplicates.** If a file exists at one of these paths, that is the only copy.

## Steps

Execute in order. Never skip a step. Each step that mentions reading a file — read it fully before acting.

### 1. Orient
- Read `PRACTICES.md` — development rules, follow strictly
- Read `CLAUDE.md` if it exists — project onboarding context

### 2. Producer Triage
- Read `agents/GAMEDEV_ROLES.md` to understand all available roles
- Read `agents/roles/producer.md` and assume the Producer role
- Run `git log --oneline -5` to see recent changes
- Read and triage `SUGGESTIONS.md` (repo root):
  - **Human Leads:** Process as directives, convert to TODO items or vision updates
  - **Agentic Roles:** Verify against GAME_VISION.md, convert valid ones to TODO items
  - Remove processed suggestions
- Read and update `agents/TODO.md`:
  - Mark completed items (cross-reference git log)
  - Remove stale items
  - Reprioritize — top item should be next up
- Read and triage `agents/BLOCKERS.md`:
  - Resolve what you can
  - Escalate what you can't
  - Remove resolved blockers

### 3. Execute → Resolve Loop

Execute the highest priority work, then resolve any blockers it created. Repeat until clean.

**3a. Execute**
- Read `agents/TODO.md` — identify the highest priority item(s)
- Pick the best-matching role from `agents/roles/`
- Read that role's .md file fully before writing any code
- Do the work — max 1-2 items, keep changes focused
- Follow all patterns from PRACTICES.md

**3b. Producer Blocker Triage**
- Re-read `agents/roles/producer.md`
- Review what was just done
- Update `agents/TODO.md` — mark completed items, add follow-ups
- Read `agents/BLOCKERS.md` — check for NEW blockers created during 3a
- If no new blockers: exit loop, proceed to step 4
- If new blockers exist: for each, identify the owning role and whether it's resolvable this run
- Remove blockers that were already resolved by the work done in 3a

**3c. Resolve Blockers**
- Pick the highest-priority unresolved blocker
- Assume the owning role (read their role .md fully)
- Do the work to properly resolve it (replace the MVP / remove the TODO comment)
- Remove the resolved blocker from BLOCKERS.md
- Return to 3b

**Loop limits:**
- Max 3 iterations of the 3b→3c loop (the initial execute in 3a doesn't count)
- After 3 iterations, any remaining blockers stay in BLOCKERS.md for the next run
- The 10-minute run timeout is the hard ceiling regardless

### 4. Lead Developer Review
- Read `agents/roles/lead-developer.md`
- Review all code changes for:
  - DRY violations
  - Entity pattern compliance
  - PRACTICES.md adherence
- Fix any issues found
- Do NOT add new features in this step

### 5. Ship It
- Commit all changes with a descriptive message
- Merge into main (use feature branch if needed)
- Bump version in: `src/index.html`, `src/pages/*.html`, `src/js/components/BottomNav.js`
- Commit the version bump
- Push to origin main

### 6. Report
- Get the final commit hash: `git rev-parse HEAD`
- Post a brief summary including:
  - New version number
  - What changed (1-3 bullets)
  - Blockers resolved this run: N
  - Any remaining blockers
  - Link to the GitHub commit: `https://github.com/clawinho/lobster-swim/commit/<HASH>`
  - Link to the live site with cache bust: `https://lobsterswim.com?v=<VERSION>`
- Keep it short. Use 🦞.

## Rules

- **Never** create files in the wrong location — check the File Locations table
- **Never** install software on the server
- **Never** skip reading a file that a step tells you to read
- If SUGGESTIONS.md and agents/TODO.md have nothing actionable, report no work needed and stop
- Quality over quantity — one solid fix beats three sloppy ones
- Each run is stateless — the repo IS the shared memory
- The Execute → Resolve loop runs at most 3 blocker iterations per run — don't chase cascading blockers forever

## For Orchestrator Implementors

To convert this into a scheduled job:
1. Set up SSH/access to the machine hosting the repo
2. Schedule the job per the frequency above
3. Inject these steps as the agent's task prompt
4. Give the agent access to: shell (git, ssh, cat, sed), file editing, and messaging (for step 6)
5. The agent needs no memory between runs — all state lives in the repo files
