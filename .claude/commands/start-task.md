---
description: Start a new task — create GitHub issue, create branch, load relevant docs
allowed-tools: Bash(git checkout:*), Bash(git branch:*), Bash(git pull:*), Bash(wsl:*)
---

## Steps

0. Ensure main is up to date:

   ```bash
   git checkout main && git pull origin main
   ```

1. Ask the user: "What is the task?" if not already clear from context.

2. Create a GitHub issue:

   ```bash
   wsl -- gh issue create --title "<title>" --body "<body>" --label "<label>" --assignee @me
   ```

   Available labels: `test` `backend` `bug` `documentation` `duplicate` `enhancement` `fix` `frontend` `good first issue` `help wanted` `invalid` `question` `wontfix`

3. Create and switch to a new branch:

   ```bash
   git checkout -b feature/<feature-name>
   ```

   Branch naming: `feature/<kebab-case-name>`

4. Read only the docs relevant to this task:

   | Doc                 | Path                                 | When to read                 |
   | ------------------- | ------------------------------------ | ---------------------------- |
   | Pages               | `docs/shared/pages.md`               | Any UI/routing work          |
   | Architecture        | `docs/shared/architecture.md`        | Any structural change        |
   | DB schema           | `docs/server/db_schema.md`           | Backend / DB work            |
   | API spec            | `docs/server/api_spec.md`            | Backend / API work           |
   | Component structure | `docs/client/component_structure.md` | Frontend work                |
   | Design              | `docs/client/design.html`            | Frontend UI work             |
   | Export functions    | `docs/shared/export_functions.md`    | When adding/changing exports |
   | Done condition      | `docs/agent/done_condition.md`       | Always read before finishing |

5. If anything is unclear after reading the docs, ask the user before starting implementation.
