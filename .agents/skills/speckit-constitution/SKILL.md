---
name: speckit-constitution
description: Create or amend `.specify/memory/constitution.md` from user-provided or inferred governance principles, then propagate policy changes to Spec-Kit templates and related guidance. Use when defining, revising, or versioning project constitution rules.
---

# Speckit Constitution

## User Input

```text
$ARGUMENTS
```

Treat non-empty user input as the highest-priority source of truth.

## Workflow

1. Load `.specify/memory/constitution.md`.
If the file is missing, copy `.specify/templates/constitution-template.md` to that path first.

2. Detect unresolved template placeholders in the constitution (`[ALL_CAPS_TOKEN]` style).
Allow intentional placeholders only when explicitly deferred and documented.

3. Resolve values in this order:
- User input from conversation/arguments
- Existing repository context (docs, prior policy wording, templates)
- Explicit TODO markers only when critical data is genuinely unknown

4. Respect the requested principle count and structure.
If the user asks for more or fewer principles than the template, adapt the sections while
preserving the template's heading hierarchy.

5. Determine version bump using semantic versioning:
- MAJOR: backward-incompatible principle or governance redefinition/removal
- MINOR: new principle/section or materially expanded requirement
- PATCH: wording clarifications, typo fixes, non-semantic refinements
If ambiguous, state rationale before finalizing.

6. Handle governance dates:
- `RATIFICATION_DATE`: keep original adoption date when known
- `LAST_AMENDED_DATE`: set to current date when content changes
- Keep dates in `YYYY-MM-DD`

7. Rewrite the constitution:
- Replace placeholders with concrete, testable policy language
- Keep headings and section order from the template
- Ensure each principle states non-negotiable requirements and rationale
- Ensure governance includes amendment process, versioning policy, and compliance review

8. Propagate consistency across related artifacts:
- `.specify/templates/plan-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/templates/commands/*.md` (if the directory exists)
- Relevant project guidance files (for example `README.md`, `docs/quickstart.md`, agent docs)
Update stale policy references when constitution changes require it.

9. Prepend a Sync Impact Report as an HTML comment at the top of the constitution:
- Version change (`old -> new`)
- Modified principles (including renames)
- Added sections
- Removed sections
- Updated templates (`updated` or `pending`) with file paths
- Deferred TODO items

10. Validate before finalizing:
- No unexplained bracket placeholders remain
- Version in body matches the report
- Dates use ISO format
- Language is declarative and testable (`MUST`/`SHOULD` with rationale when needed)

11. Write final content back to `.specify/memory/constitution.md`.

12. Return a concise user summary:
- New version and bump rationale
- Follow-up files/TODOs
- Suggested commit message

## Output Style

- Keep Markdown heading levels identical to the constitution template.
- Keep sections separated by a single blank line.
- Avoid trailing whitespace.
