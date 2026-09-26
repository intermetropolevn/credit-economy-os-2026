# MCP Layer

The MCP registry in `src/services/mcpRegistryService.ts` is a simulated tool catalog for the demo. It classifies tools by domain and access level and records simulated execution information such as actor, tool, validation, status, and duration.

The registry supports the prototype's CREDIT, CAMPAIGN, POOL, PARTNER, USER, ANALYTICS, and REDEMPTION narratives. Its endpoints use `example.invalid` placeholders and do not make live outbound connections. Tool records are intended to demonstrate controlled orchestration, not production MCP connectivity.
