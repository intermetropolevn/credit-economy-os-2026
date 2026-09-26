# AI Control Plane

The AI Control Plane is an orchestration and recommendation layer. It can inspect the demo transaction payload, formulate a verification proposal, and present a recommendation with evidence, risk, and confidence.

It is not the source of truth. The authoritative boundaries are the ledger model, rules, eligibility checks, risk controls, clearing logic, and the server-side verification validation step.

The default `DeterministicDemoProvider` makes the project runnable without a network call or API key. A remote provider can be configured only through server environment variables. Regardless of provider, a response is parsed as untrusted input and normalized before it is exposed to the UI. It cannot silently execute settlement.
