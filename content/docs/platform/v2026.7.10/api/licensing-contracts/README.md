---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-licensing-contracts-readme
    name: Overview
    parent: api-licensing-contracts
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/licensing-contracts/
aliases:
- /docs/platform/v2026.7.10/api/licensing-contracts/overview/
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

Contracts bind an organization to products, clusters, and quotas; licenses are issued per
contract-cluster. The license flow is what member clusters (via `license-proxyserver`) use.

## License registration (always available)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/register` | License validation | Register / validate a licensed cluster |
| POST | `/api/v1/license/issue` | Token + license issuance checks | Issue a license |

## Contracts — admin (`/api/v1/contracts`, AppsCode-hosted, site-admin authz)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/` | List / create contracts |
| GET/PUT/DELETE | `/:id/` | Get / update / delete a contract |
| POST | `/:id/extend`, `/:id/revoke` | Extend / revoke a contract |
| GET | `/:id/document` | Download the contract document |
| GET | `/:id/audit` | Contract audit history |
| GET | `/:id/clusters/imported/non-associated` | Importable clusters not yet bound |
| GET/POST | `/:id/clusters/` | List / bind clusters to the contract |
| DELETE | `/:id/clusters/:ccID/` | Remove a cluster from the contract |
| POST | `/:id/clusters/:ccID/issue-license` | Issue a full license for a contract cluster |
| PATCH | `/:id/clusters/:ccID/{name,tags}` | Rename / retag a contract cluster |
| GET | `/active/associated-clusters/:clusterID/status`, POST `/active/associated-clusters/batch-status` | Contract status per cluster (single / batch) |
| GET | `/available_products` | Products available for new contracts |

## Contracts — user (`/api/v1/user/contracts`, AppsCode-hosted, Token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List my contracts |
| GET | `/active-offline-contracts` | List active offline contracts |
| POST | `/assign-cluster` | Assign a cluster to multiple contracts |
| GET | `/active/associated-with/clusters/:clusterID`, `/active/not-associated-with/clusters/:clusterID` | Contracts (not) associated with a cluster |
| GET | `/active/associated-clusters/` (+`/:clusterID/status`, POST `/batch-status`) | Cluster association status |
| GET | `/:id/` (+`/document`, `/audit`) | Contract details, document, audit |
| PUT | `/:id/preferences` | Update contract preferences |
| GET/POST | `/:id/clusters/` (+`imported/non-associated`) | List / bind clusters |
| DELETE | `/:id/clusters/:ccID/`, PATCH `/:ccID/{name,tags}` | Manage contract clusters |
| POST | `/:id/clusters/:ccID/issue-license` | Issue a license for my contract cluster |

Related: `POST /api/v1/user/license-proxy` — generate the `license-proxyserver` installer for a cluster.

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
