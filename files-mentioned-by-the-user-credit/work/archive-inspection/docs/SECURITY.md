# Security

- Demo data is synthetic and uses `demo.example` identities and `example.invalid` integration endpoints.
- The default application requires zero external credentials.
- Optional remote AI credentials are server-only environment variables and are excluded by `.gitignore`.
- AI output is a recommendation, never an authorization or ledger mutation.
- The verification engine checks enum values, bounds, and `release + hold = total` before it returns a result.
- Sensitive settlement in the demo is gated by an explicit human approval flow.

Before publishing, run the repository sweep documented in the root README and verify that local environment files or build output are not staged.
