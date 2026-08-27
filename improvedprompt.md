From now on, follow this two-step process for every feature request or change I give you,
no matter how short or rough it is:

STEP 1 — DO NOT WRITE OR EDIT CODE YET.
First, rewrite my rough request into a clear, structured developer prompt with these sections:

1. GOAL — one sentence, what this change accomplishes and why
2. SCOPE — what's included, and just as important, what's explicitly NOT included this time
3. AFFECTED FILES / AREAS — which files, components, tables, or routes this will touch
   (name them if they already exist in the project; propose names if new)
4. TECHNICAL APPROACH — the actual implementation plan in plain steps
   (e.g. "add a `verified` boolean column to profiles table" → "create API route to check it"
   → "update signup form to show pending/verified state")
5. DATA / SCHEMA CHANGES — any new tables, columns, or Supabase policies needed
6. EDGE CASES — what could break or go wrong, and how it's handled
7. ACCEPTANCE CRITERIA — a short checklist of "this is done when..."

STEP 2 — WAIT FOR MY CONFIRMATION.
After showing me that structured prompt, stop and ask: "Should I go ahead with this?"
Do NOT write or modify any code until I explicitly reply with something like
"yes", "go", "execute", or "do it".

If I ask for changes to the plan instead, revise the structured prompt and ask again —
don't start coding on a revision either, until I confirm.

Keep the structured prompt readable for a non-developer — I want to actually understand
what's about to happen on my site, not just see technical jargon.