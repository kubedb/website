---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-licensing-contracts-contracts-admin
    name: Contracts — Admin
    parent: api-licensing-contracts
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Contracts — Admin

The site-admin console for managing every contract across accounts. All routes on this
page are rooted at `/api/v1/contracts` (paths below are shown relative to that root, so
`GET /` is `GET /api/v1/contracts`).

- **Auth:** token plus **site-admin** authorization (the specific permission is noted
  per endpoint, e.g. `view_contracts:site_admin`). **AppsCode-hosted only.**
- **Owner scope:** every endpoint accepts the optional `?org=<slug>` query parameter to
  scope the target account; when omitted the caller's account is used.

> **Deployment note.** These routes are AppsCode-hosted-only and are **not registered on
> self-hosted platforms**. See the verification notes below.

---

## Shared object: `Contract`

Most read/write endpoints return a `Contract`. Its fields:

| Field | Type | Description |
|---|---|---|
| `id` | int64 | Contract ID. |
| `uid` | int64 | Owner account ID. |
| `orgOrUser` | string | Owner org/user slug. |
| `name` | string | Contract name. |
| `product` | string | Product alias the contract covers. |
| `features` | array of string | Licensed features. |
| `clusters` | array of `ContractClusterStatus` | Clusters bound to the contract (see below). |
| `associatedCluster` | `ContractClusterStatus` | The cluster currently in context, when applicable. |
| `emails` | `ContractEmail` | Notification recipients (`contactPerson`, `signingAuthority`, `licenseUsers`, `financeTeam`, `usageAlertClient`, `usageAlertAdmin`; each a string array). |
| `quota` | `QuotaRule` | `enabled`, `metric` (e.g. `memory_gib_month`), `limit`, `alertThresholds` (int array), `disableLicenseOnLimitReached`. |
| `start` | int64 | Contract start time (Unix seconds). |
| `end` | int64 | Contract end time (Unix seconds). |
| `documentPath` | string | Stored contract-document path. |
| `allowOffline` | boolean | Whether offline (air-gapped) licenses are permitted. |
| `autoAssignCluster` | boolean | Auto-assign newly imported clusters. |
| `disableAnalytics` | boolean | Disable analytics reporting. |
| `enableClientBilling` | boolean | Enable client (managed-service) billing. |
| `revoked` | boolean | Whether the contract is revoked. |
| `restrictions` | string | JSON-encoded restrictions data. |

`ContractClusterStatus`: `{ id (int64, the contract-cluster ID), contractId, cluster
(UUID), displayName, clusterStatus { isImported, name, tags[], associatedContractId },
duplicateContractFeatures[] { contractId, product, features[] }, error }`.

---

## `GET /` — list all contracts

List all contracts across accounts (scoped by `org`).

- **Auth:** site-admin (`view_contracts:site_admin`).
- **Query:** `org` (string, optional) — owner context.
- **Response:** `200 OK` — array of [`Contract`](#shared-object-contract).

```json
[
  {
    "id": 42,
    "orgOrUser": "appscode",
    "name": "Acme KubeDB 2026",
    "product": "kubedb",
    "features": ["kubedb", "kubedb-provisioner"],
    "start": 1767225600,
    "end": 1798761600,
    "allowOffline": true,
    "revoked": false
  }
]
```

> **Verified:** `GET /contracts?org=appscode` returned `404` against the self-hosted platform on 2026-07-14 — contracts APIs are AppsCode-hosted-only and not registered here (token confirmed valid: `GET /user` returned `200`).

Errors: `401` Unauthorized, `403` Forbidden (site-admin authorization required).

```bash
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/contracts?org=appscode"
```

---

## `POST /` — create contract(s)

Create one or more contracts (one per product listed in `products`).

- **Auth:** site-admin (`create_contracts:site_admin`).
- **Request body:** `multipart/form-data` (so an optional contract `document` file may be
  uploaded). Fields mirror [`Contract`](#shared-object-contract) except it takes a
  `products` array (creating one contract per product) instead of a single `product`,
  and an optional `document` file part.
- **Response:** `201 Created`. Errors: `400` (empty products, invalid emails,
  unsupported product, or bad quota), `401`, `403`, `422`.

---

## `GET /{id}` — get a contract

- **Auth:** site-admin (`view_contracts:site_admin`).
- **Path:** `id` (int64, required) — contract ID.
- **Response:** `200 OK` — a [`Contract`](#shared-object-contract). Errors: `401`, `403`, `404` (not found).

---

## `PUT /{id}` — update a contract

- **Auth:** site-admin (`update_contracts:site_admin`).
- **Path:** `id` (int64, required).
- **Request body:** `multipart/form-data` (optional replacement `document` file); fields
  mirror [`Contract`](#shared-object-contract).
- **Response:** `200 OK` — updated [`Contract`](#shared-object-contract). Errors: `400`
  (invalid quota or emails), `401`, `403`, `404`, `422`.

---

## `DELETE /{id}` — delete a contract

- **Auth:** site-admin (`delete_contracts:site_admin`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK`. Errors: `401`, `403`, `404`.

---

## `POST /{id}/extend` — extend a contract

Extend a contract's end time using the `end` field of the request body.

- **Auth:** site-admin (`extend_contracts:site_admin`).
- **Path:** `id` (int64, required).
- **Request body** (`application/json`): a `Contract` object; only `end` (Unix seconds)
  is used.

```json
{ "end": 1830297600 }
```

- **Response:** `200 OK` — extended [`Contract`](#shared-object-contract). Errors:
  `401`, `403`, `404`, `422`.

---

## `POST /{id}/revoke` — revoke a contract

- **Auth:** site-admin (`revoke_contracts:site_admin`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK`. Errors: `401`, `403`, `404`.

---

## `GET /{id}/document` — download contract document

Return a time-limited signed URL (as a JSON string, valid 30 minutes) to download the
contract document.

- **Auth:** site-admin (`view_contracts:site_admin`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK` — a JSON string URL, e.g. `"https://storage.example.com/…?sig=<sig>"`.
  Errors: `401`, `403`, `404`.

---

## `GET /{id}/audit` — contract audit history

- **Auth:** contract-management (`view_contracts:contract_mgmt`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK` — array of audit events:

```json
[
  { "id": 1, "contractID": 42, "addedBy": "user@example.com", "event": "contract.created", "createdUnix": 1767225600 }
]
```

Errors: `401`, `403`, `404`.

---

## `GET /{id}/clusters` — list bound clusters

- **Auth:** site-admin (`add_cluster:site_admin`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK` — array of `ContractClusterStatus` (see
  [shared object](#shared-object-contract)). Errors: `401`, `403`.

---

## `POST /{id}/clusters` — bind clusters

Bind one or more clusters to the contract.

- **Auth:** site-admin (`add_cluster:site_admin`).
- **Path:** `id` (int64, required).
- **Request body** (`application/json`): array of cluster references.

```json
[
  { "displayName": "prod-east", "cluster": "c122d5e0-8d6b-4025-a2ff-63f5716053b1", "tags": ["prod"] }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `cluster` | string | yes | Cluster UUID (validated as a UUID). |
| `displayName` | string | no | Display name for the binding. |
| `tags` | array of string | no | Tags for the cluster. |

- **Response:** `201 Created` — updated `ContractClusterStatus` list. Errors: `400`
  (empty list, invalid UUID, or already associated), `401`, `403`, `422`.

---

## `GET /{id}/clusters/imported/non-associated` — importable clusters

List the owner's imported clusters not yet bound to the contract.

- **Auth:** site-admin (`add_cluster:site_admin`).
- **Path:** `id` (int64, required).
- **Response:** `200 OK` — array of cluster-info records (`id`, `displayName`, `name`,
  `uid`, `provider`, `kubernetesVersion`, `nodeCount`, `status` (a Kubernetes-style
  `rsapi.ClusterStatus` object), and related fields). Errors: `400` (contract not
  found), `401`, `403`.

---

## `DELETE /{id}/clusters/{ccID}` — remove a cluster

- **Auth:** site-admin (`remove_cluster:site_admin`).
- **Path:** `id` (int64), `ccID` (int64, the contract-cluster ID). Both required.
- **Response:** `200 OK`. Errors: `401`, `403`.

---

## `POST /{id}/clusters/{ccID}/issue-license` — issue full license

Issue a full (offline-capable) license for the given contract cluster.

- **Auth:** site-admin (`issue_license:site_admin`).
- **Path:** `id` (int64), `ccID` (int64). Both required.
- **Response:** `200 OK` — a license object (same shape as
  [`POST /license/issue`](../registration.md)): `{ contract { id,
  startTimestamp, expiryTimestamp }, license }`. Errors: `401`, `403` (quota exceeded or
  authorization required), `404`, `405` (revoked contract or offline not allowed).

---

## `PATCH /{id}/clusters/{ccID}/name` — rename a contract cluster

- **Auth:** site-admin (`update_cluster_name:site_admin`).
- **Path:** `id` (int64), `ccID` (int64). Both required.
- **Request body** (`application/json`): `{ "clusterName": "prod-east" }`.
- **Response:** `200 OK`. Errors: `401`, `403`, `422`.

---

## `PATCH /{id}/clusters/{ccID}/tags` — retag a contract cluster

Replace the tag set for a cluster and sync it across contracts sharing the same cluster
UUID.

- **Auth:** site-admin (`update_cluster_tags:site_admin`).
- **Path:** `id` (int64), `ccID` (int64). Both required.
- **Request body** (`application/json`): `{ "tags": ["prod", "east"] }`.
- **Response:** `200 OK`. Errors: `401`, `403`, `422`.

---

## `GET /active/associated-clusters/{clusterID}/status` — single-cluster status

Return the association/validity status of a single cluster for the target user.

- **Auth:** site-admin (`view_contracts:site_admin`).
- **Path:** `clusterID` (string, required) — cluster UUID.
- **Query:** `orgOrUserId` (int64, optional — target account ID; defaults to the caller
  when omitted or `0`), `contract` (int64, optional — contract ID to check against),
  `org` (string, optional).
- **Response:** `200 OK` — a `ContractClusterStatus`. Errors: `401`, `403`, `500`.

---

## `POST /active/associated-clusters/batch-status` — batch-cluster status

Return association/validity status for a batch of clusters for the target user.

- **Auth:** site-admin (`view_contracts:site_admin`).
- **Query:** `orgOrUserId` (int64, optional), `contract` (int64, optional), `org` (string, optional).
- **Request body** (`application/json`): `{ "clusters": ["<uid1>", "<uid2>"] }`.
- **Response:** `200 OK` — array of `ContractClusterStatus`. Errors: `401`, `403`, `422`, `500`.

---

## `GET /available_products` — products available for contracts

Return the map of non-community products supported for contracts, keyed by product alias.

- **Auth:** site-admin (`create_contracts:site_admin`).
- **Query:** `org` (string, optional).
- **Response:** `200 OK` — a JSON object mapping product alias → plan info (free-form
  object).

```json
{
  "kubedb": { "name": "KubeDB", "plans": ["enterprise"] },
  "stash": { "name": "Stash", "plans": ["enterprise"] }
}
```

> **Verified:** `GET /contracts/available_products?org=appscode` returned `404` against the self-hosted platform on 2026-07-14 — AppsCode-hosted-only route, not registered here (token confirmed valid via `GET /user` → `200`).

Errors: `401`, `403`.
