---
description: Commit, push, create PR, run CI, review, and merge
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git push:*), Bash(git checkout:*), Bash(git pull:*), Bash(git branch:*), Bash(wsl:*)
---

## Commit message format

Follow Conventional Commits:

```
<type>(<scope>): <short description>

Types: feat, fix, refactor, docs, test, chore, style
Scope: client, server, shared (optional)

Examples:
  feat(client): add language selector to editor
  fix(server): handle missing token in auth middleware
  docs: update api_spec with new endpoint
```

Rules:

- No `Co-Authored-By` line
- No AI tool mentions

## Steps

1. Stage relevant files:

   ```bash
   git add <specific files>
   ```

2. Commit:

   ```bash
   git commit -m "<type>(<scope>): <description>"
   ```

3. Push:

   ```bash
   git push -u origin <branch>
   ```

4. Write a report to `.claude/reports/<branch-name>.md` with the following format:

   ```markdown
   # Report: <branch-name>

   ## Summary

   <1-2 sentence description of what was done>

   ## Changed files

   | File   | Change                       |
   | ------ | ---------------------------- |
   | <path> | <added / modified / deleted> |

   ## Commit

   `<commit message>`

   ## Issue

   closes #<issue-number>
   ```

   Then stop and show the report to the user. Wait for approval before proceeding.

5. Create PR:

   ```bash
   wsl -- gh pr create --title "<title>" --body "$(cat <<'EOF'
   ## Summary
   - <bullet points>

   ## Test plan
   - <checklist>

   closes #<issue-number>
   EOF
   )" --assignee @me
   ```

   Rules:
   - No `🤖 Generated with Claude Code` line
   - No AI tool mentions
   - Include `closes #<issue-number>`

6. Wait for CI:

   ```bash
   wsl -- gh pr checks <number> --watch
   ```

7. Run `/review` to review the PR. If issues found, fix and push again (repeat from step 1).

8. Merge and clean up:
   ```bash
   wsl -- gh pr merge <number> --merge --delete-branch
   git checkout main && git pull origin main && git branch -d <branch>
   ```
