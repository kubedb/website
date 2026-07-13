---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-licensing-contracts
    name: Licensing & Contracts
    parent: api
    weight: 120
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Licensing & Contracts

Contracts bind an organization (or user) to products, clusters, and usage quotas;
licenses are issued per contract-cluster. This group covers three related concerns:

- **License registration** — the always-available endpoints that member clusters
  (via `license-proxyserver`) use to validate a license and obtain a fresh one.
- **Contracts (admin)** — the AppsCode-hosted, site-admin console for managing every
  contract across accounts.
- **Contracts (user)** — the AppsCode-hosted, token-scoped API an organization uses to
  manage its own contracts, bind clusters, and issue offline licenses.

All routes are served under the `/api/v1` prefix.

> **Deployment note.** The `/contracts/*` and `/user/contracts/*` families — plus
> `POST /user/license-proxy` — are **AppsCode-hosted-only**. On a self-hosted platform
> these routes are not registered and return `404 Not Found`. They are documented here
> for completeness; the verification notes below record the observed behavior on the
> self-hosted test platform.

## Pages

- [License Registration](../registration.md) — `POST /register`,
  `POST /license/issue`, `POST /user/license-proxy`.
- [Contracts — Admin](../contracts-admin.md) — `/contracts/*`
  (AppsCode-hosted, site-admin).
- [Contracts — User](../contracts-user.md) — `/user/contracts/*`
  (AppsCode-hosted, token).

## Common concepts

- **Owner scope.** Contract endpoints accept an owner (organization) context via the
  optional `?org=<slug>` query parameter. When omitted, the caller's own account is used.
- **Contract IDs** (`id`) are numeric (`int64`). A **contract-cluster ID** (`ccID`) is
  the numeric ID of a cluster's binding within a specific contract — distinct from the
  cluster UUID.
- **Cluster UUID** (`clusterID` / `cluster`) is the cluster's UUID string.
- Timestamps on the `Contract` object (`start`, `end`) are Unix seconds.
