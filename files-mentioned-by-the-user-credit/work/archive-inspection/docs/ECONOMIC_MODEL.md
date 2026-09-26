# Economic Model

The demo models credit as programmable value rather than a cryptocurrency asset. Credit types, earning rules, redemption rules, pools, inventory, and settlement are represented with synthetic in-memory data.

The illustrative transaction flow protects a core invariant: the release amount plus the held amount must equal the transaction value. Server-side verification clamps amounts to non-negative bounds and repairs any non-conserving AI proposal before the result reaches the client. The user-facing settlement flow also requires an explicit human approval action.

The ledger and audit views are prototype simulations. They demonstrate double-entry and append-only concepts but are not a production accounting system.
