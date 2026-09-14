---
name: auto-commit-monitor
description: Starts a recurring 5-minute schedule to check for git changes, suggest commit messages, and advise on the correct base branch for creating new branches.
---

# Auto Commit Monitor Skill

When the user asks you to start the auto commit monitor or run this skill, you must use the `schedule` tool to start a background task with the following settings:

- **CronExpression**: `*/5 * * * *`
- **IsDaemon**: true
- **Prompt**: "Analyze the repository for uncommitted changes and branch structure. 1. Run `git status` and `git branch -a` to understand the current branch and repository state. 2. If there are changes, run `git diff`. 3. Based on the changes, ask the user if they want to commit all changes together or split them logically (e.g., multiple smaller commits). 4. Generate concise and standard commit messages (e.g., Conventional Commits) for the proposed commit(s). 5. Branch Recommendation: Check the existing branches (e.g., `main`, `master`, `develop`, feature branches) and advise the user which base branch should be used to create a new branch for the current/upcoming work (e.g., recommend branching off `main` or `develop`), along with suggested branch naming and exact commands (e.g., `git checkout <base-branch> && git pull && git checkout -b feature/<name>`). 6. Notify the user of the changed files, suggested commit messages, base branch recommendation, and the ready-to-run git commands."

# How to Run

- "start auto-commit-monitor skill"
- "run auto commit monitor"
- Mention `@auto-commit-monitor` and ask to start/run it.
