---
name: Vite React duplication
description: Why "Invalid hook call / multiple copies of React" happens in this Vite setup and how to avoid it.
---

# Vite React duplication → "Invalid hook call"

Mixing the `@/` path alias and relative paths (`./lib/...`) to import the **same**
module from different files can make Vite build two separate module graphs, loading
two copies of React. Symptoms: blank page, "Invalid hook call", "more than one copy
of React", and context errors like "useCart must be used within CartProvider" (the
provider and consumer ended up on different React instances).

**Why:** the dev server keyed modules by the literal import specifier, so `@/lib/cart`
and `./lib/cart` resolved to distinct entries even though they're the same file.

**How to apply:**
- Pick ONE import style for shared modules (this project uses the `@/` alias) and use
  it consistently, including in `main.tsx`.
- Keep these guards in `vite.config.ts`: `resolve.dedupe: ["react","react-dom"]` and
  `optimizeDeps.include: ["react","react-dom","react-dom/client"]`.
- For the Replit proxied preview, also set `server: { host: true, allowedHosts: true }`.
