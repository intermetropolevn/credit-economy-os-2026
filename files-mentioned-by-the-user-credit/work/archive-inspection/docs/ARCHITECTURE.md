# Architecture

Credit Economy OS is a Vite + React prototype with an Express development server. Screens share in-memory synthetic state through `src/context/EconomicContext.tsx`; domain-oriented demo services model MCP orchestration, wallet activity, partner campaigns, intelligence, pools, and experiences.

```text
React screens and components
          ↓
Economic context + domain demo services
          ↓
Express API /api/verify
          ↓
AI provider adapter → validation boundary
          ↓
Deterministic demo assessment or optional remote proposal
```

`server/ai/provider.ts` defines the provider interface. `modelRegistry.ts` selects the deterministic provider unless an explicitly configured remote provider is available. `verificationEngine.ts` is the validation boundary: it normalizes amounts, validates enums, and enforces release plus hold equals the submitted total before returning a result.

The prototype does not persist data or connect to real payment, identity, inventory, or partner systems.
