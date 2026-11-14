---
name: context7
description: "Real-time, version-specific library and API documentation lookup via Context7 (Upstash). Search and fetch current documentation, API signatures, and verified code examples using Context7 MCP tools (resolve-library-id, query-docs) or the ctx7 CLI. Use whenever the user asks about library APIs, frameworks, SDKs, version migrations, or modern web technologies (React 19, Next.js 15, Tailwind v4, Prisma, etc.)."
---

# Context7: Real-Time Documentation & Code Brain

Context7 provides real-time, version-accurate documentation and code snippets directly from official first-party sources, eliminating AI hallucination for modern APIs, recent version releases, and evolving frameworks.

---

## 1. Dual Operational Modes

Context7 operates in two complementary modes depending on the agent environment:
1. **MCP Mode (Model Context Protocol)**: Direct JSON-RPC tool calls (`resolve-library-id`, `query-docs`).
2. **CLI Mode (`ctx7`)**: Shell-executable commands via `npx ctx7@latest`.

---

## 2. MCP Tool Workflow (Fastest for Agents with MCP Access)

When the `context7` MCP server is registered in your environment, use the two-step tool sequence:

### Step 1: Resolve Library ID (`resolve-library-id`)
Maps the informal framework or library name to the canonical `/org/project` ID:
- **Parameters**:
  - `libraryName`: Official library name (e.g., `"Next.js"`, `"React"`, `"Tailwind CSS"`, `"Prisma"`).
  - `query`: Specific topic of interest to rank relevance.
- **Selection Rule**: Select the entry with the highest benchmark score, snippet coverage, and matching version requirements.

### Step 2: Query Documentation (`query-docs`)
Fetches authoritative markdown docs and code snippets:
- **Parameters**:
  - `libraryId`: Canonical ID from Step 1 (e.g., `"/vercel/next.js"`, `"/reactjs/react.dev"`, `"/tailwindlabs/tailwindcss"`).
  - `query`: Focused query string describing the specific API or implementation pattern.

---

## 3. CLI Workflow (`npx ctx7@latest`)

If invoking via shell or terminal execution:

```bash
# Step 1: Resolve library
npx ctx7@latest library <name> "<query>"

# Step 2: Query documentation
npx ctx7@latest docs <libraryId> "<query>"

# Quick direct search across all indexed libraries:
npx ctx7@latest search "<query>"
```

### Examples:
```bash
npx ctx7@latest library React "useEffect cleanup async"
npx ctx7@latest docs /reactjs/react.dev "useEffect cleanup"
npx ctx7@latest docs /vercel/next.js/v16.2.9 "App router server actions"
```

---

## 4. Query Best Practices & Guardrails

- **One Topic per Query**: Never combine orthogonal topics into one call (e.g., separate `"auth"` and `"caching"` into two targeted queries).
- **No Sensitive Data**: Never send API keys, secrets, proprietary passwords, or personal credentials in queries.
- **Version Pinning**: Use the version suffix `/org/project/version` when targeting breaking changes or legacy releases.

---

## 5. Authentication & Quota Management

- **Default**: Functions out-of-the-box with generous free community quotas without requiring an account.
- **Higher Limits**:
  - Set environment variable: `CONTEXT7_API_KEY=your_key`
  - Or interactive login: `npx ctx7@latest login`
