# Credit Economy OS

An AI-native economic control plane for programmable value — a hackathon prototype by [Intermetropole](https://github.com/intermetropolevn).

## Why it exists

Loyalty and incentive programs commonly isolate wallets, rules, inventory, experiences, analytics, and settlement. Credit Economy OS explores a single control plane that connects these layers while keeping economic validation separate from AI recommendations.

## Core idea

```text
User → Trigger → Eligibility → Credit → Pool → Reward → Experience
     → Redemption → Ledger → Analytics → AI Control Plane
```

## Architecture

```text
Human operator
      ↓
AI control plane (observation and recommendations)
      ↓
MCP registry / tool registry
      ↓
Authoritative demo engines
Ledger · Rules · Eligibility · Risk · Clearing
      ↓
In-memory economic state and synthetic demo data
```

The AI layer can propose a verification result. It cannot directly mutate the ledger, bypass balance checks, or approve sensitive actions. The server validates proposed amounts and enums before returning them to the UI.

## Modules

- Dashboard, Users, and Organizations
- Economy: credit types, rules, wallet policies, health, ledger, and audit
- Programs: quests, campaigns, templates, approvals, and simulation
- Destination Pools and reward inventory
- Digital Experience Layer: journeys, marketplace, personalization, touchpoints, and analytics
- Analytics, Operations, AI Control Plane, and MCP registry

## Demo

The default is deterministic demo mode. It starts with synthetic data and needs no credentials:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then use the guided demo bar or visit the transaction flow. The server's `POST /api/verify` endpoint returns a deterministic AI proposal and validates the `release + hold = total value` invariant.

## Optional AI integration

The server defaults to `AI_PROVIDER=demo`. A generic remote adapter is available for an intentionally compatible, server-side endpoint:

```bash
AI_PROVIDER=remote
AI_INFERENCE_ENDPOINT=https://example.invalid/v1/inference
AI_INFERENCE_API_KEY=local-secret
AI_MODEL=optional-model-identifier
```

The remote endpoint receives `{ task, model, systemInstruction, input, responseFormat }` and may return JSON in `content`, `output`, or `result`. This is experimental; no AI credential is sent to the browser.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

See [docs/DEMO.md](docs/DEMO.md) for the walkthrough and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for implementation notes.

## Security and project status

This repository uses fictional seed data and public-safe placeholder endpoints. It is an experimental hackathon architecture, not production financial infrastructure. Sensitive operations in the demo require an explicit human approval step, while AI outputs remain recommendations. See [docs/SECURITY.md](docs/SECURITY.md).

## License

Released under the [MIT License](LICENSE). This license applies to this repository's original code only; bundled third-party dependencies retain their own licenses.
