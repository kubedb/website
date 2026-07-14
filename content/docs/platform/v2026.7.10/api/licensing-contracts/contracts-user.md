---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-licensing-contracts-contracts-user
    name: Contracts — User
    parent: api-licensing-contracts
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Contracts — User

The token-scoped API an organization uses to manage its own contracts, bind clusters,
and issue offline licenses. All routes on this page are rooted at
`/api/v1/user/contracts` (paths below are relative to that root, so `GET /` is
`GET /api/v1/user/contracts`).

- **Auth:** token (`Authorization: token <token>`). Some write endpoints require an
  extra authorization check, noted per endpoint. **AppsCode-hosted only.**
- **Owner scope:** every endpoint accepts the optional `?org=<slug>` query parameter to
  scope the target account; when omitted the caller's account is used.

The `Contract` and `ContractClusterStatus` object shapes are the same as documented on
the [Contracts — Admin](../contracts-admin.md) page (user responses
sanitize admin-only email fields).

> **Deployment note.** These routes are AppsCode-hosted-only and are **not registered on
> self-hosted platforms**. See the verification notes below.

---

## `GET /` — list my contracts

List the contracts owned by the resolved owner.

- **Auth:** token.
- **Query:** `org` (string, optional).
- **Response:** `200 OK` — array of `Contract`.

```json
[
  {
    "id": 42,
    "orgOrUser": "appscode",
    "name": "Acme KubeDB 2026",
    "product": "kubedb",
    "features": ["kubedb"],
    "start": 1767225600,
    "end": 1798761600,
    "allowOffline": true,
    "autoAssignCluster": false,
    "revoked": false
  }
]
```

> **Verified:** `GET /user/contracts?org=appscode` returned `404` against the self-hosted platform on 2026-07-14 — contracts APIs are AppsCode-hosted-only and not registered here (token confirmed valid: `GET /user` returned `200`).

Errors: `401`, `403`.

```bash
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/user/contracts?org=appscode"
```

---

## `GET /active-offline-contracts` — list active offline contracts

List the owner's active offline (air-gapped) contracts.

- **Auth:** token. **Query:** `org` (optional).
- **Response:** `200 OK` — array of `Contract`.

> **Verified:** `GET /user/contracts/active-offline-contracts?org=appscode` returned `404` on 2026-07-14 — AppsCode-hosted-only route, not registered on the self-hosted platform.

Errors: `401`, `403`.

---

## `POST /assign-cluster` — assign a cluster to multiple contracts

Assign a single cluster to multiple contracts owned by the caller.

- **Auth:** token plus contract-management authorization (`add_cluster:contract_mgmt`).
- **Query:** `org` (optional).
- **Request body** (`application/json`):

```json
{
  "clusterId": "c122d5e0-8d6b-4025-a2ff-63f5716053b1",
  "displayName": "prod-east",
  "contractIds": [42, 43]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterId` | string | yes | Cluster UUID. |
| `displayName` | string | no | Display name for the cluster. |
| `contractIds` | array of int64 | yes | Contracts to assign the cluster to. |

- **Response:** `200 OK`. Errors: `400` (empty contract list or invalid cluster UUID),
  `401`, `403`, `422`.

---

## `GET /active/associated-with/clusters/{clusterID}` — contracts on a cluster

List the owner's active contracts associated with the given cluster.

- **Auth:** token.
- **Path:** `clusterID` (string, required) — cluster UUID.
- **Query:** `onlyOffline` (boolean, optional — restrict to offline contracts), `org` (optional).
- **Response:** `200 OK` — array of `Contract`. Errors: `401`, `403`.

---

## `GET /active/not-associated-with/clusters/{clusterID}` — contracts not on a cluster

List the owner's active contracts that are **not** associated with the given cluster.

- **Auth:** token. **Path:** `clusterID` (string, required). **Query:** `org` (optional).
- **Response:** `200 OK` — array of `Contract`. Errors: `401`, `403`.

---

## `GET /active/associated-clusters` — clusters of my active offline contracts

List the unique clusters associated with the owner's offline active contracts.

- **Auth:** token. **Query:** `org` (optional).
- **Response:** `200 OK` — array of cluster records:

```json
[
  {
    "associatedContractIDs": [42, 43],
    "cluster": "c122d5e0-8d6b-4025-a2ff-63f5716053b1",
    "displayName": "prod-east",
    "tags": ["prod"]
  }
]
```

> **Verified:** `GET /user/contracts/active/associated-clusters?org=appscode` returned `404` on 2026-07-14 — AppsCode-hosted-only route, not registered on the self-hosted platform (token confirmed valid via `GET /user` → `200`).

Errors: `401`, `403`.

---

## `GET /active/associated-clusters/{clusterID}/status` — single-cluster status

Return the association/validity status of a single cluster for the caller.

- **Auth:** token.
- **Path:** `clusterID` (string, required) — cluster UUID.
- **Query:** `contract` (int64, optional — contract ID to check against), `org` (optional).
- **Response:** `200 OK` — a `ContractClusterStatus`. Errors: `401`, `403`, `500`.

---

## `POST /active/associated-clusters/batch-status` — batch-cluster status

Return association/validity status for a batch of clusters for the caller.

- **Auth:** token.
- **Query:** `contract` (int64, optional), `org` (optional).
- **Request body** (`application/json`): `{ "clusters": ["<uid1>", "<uid2>"] }`.
- **Response:** `200 OK` — array of `ContractClusterStatus`. Errors: `401`, `403`, `422`, `500`.

---

## `GET /{id}` — get one of my contracts

Return a single contract owned by the caller (admin-only email fields sanitized).

- **Auth:** token. **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Response:** `200 OK` — a `Contract`. Errors: `401`, `403`, `404`.

---

## `PUT /{id}/preferences` — update contract preferences

Update the caller-editable preferences (auto-assign clusters, usage-alert client
recipients) for one of the caller's contracts.

- **Auth:** token plus authorization (`updated_preferences:contracts`).
- **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Request body** (`application/json`):

```json
{
  "autoAssignCluster": true,
  "usageAlertClient": ["ops@example.com"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `autoAssignCluster` | boolean | no | Auto-assign newly imported clusters to this contract. |
| `usageAlertClient` | array of string | no | Usage-alert recipient emails (a single string is normalized to a one-element array). |

- **Response:** `200 OK` — updated `Contract`. Errors: `400` (invalid recipients),
  `401`, `403`, `422`.

---

## `GET /{id}/audit` — contract audit history

- **Auth:** token. **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Response:** `200 OK` — array of audit events (`id`, `contractID`, `addedBy`,
  `event`, `createdUnix`). Errors: `401`, `403` (not found or authorization denied).

---

## `GET /{id}/document` — download contract document

Return a time-limited signed URL (as a JSON string, valid 30 minutes) to download the
contract document.

- **Auth:** token. **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Response:** `200 OK` — a JSON string URL. Errors: `401`, `403`, `404`.

---

## `GET /{id}/clusters` — list bound clusters

- **Auth:** token. **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Response:** `200 OK` — array of `ContractClusterStatus`. Errors: `401`, `403`.

---

## `POST /{id}/clusters` — bind clusters

Bind one or more clusters to one of the caller's contracts.

- **Auth:** token plus authorization.
- **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Request body** (`application/json`): array of `{ cluster (UUID, required),
  displayName, tags[] }` — same shape as the admin bind endpoint.
- **Response:** `201 Created` — updated `ContractClusterStatus` list. Errors: `400`
  (empty list, invalid UUID, invalid contract, or already associated), `401`, `403`, `422`.

---

## `GET /{id}/clusters/imported/non-associated` — importable clusters

List the owner's imported clusters not yet bound to the contract.

- **Auth:** token. **Path:** `id` (int64, required). **Query:** `org` (optional).
- **Response:** `200 OK` — array of cluster-info records (same shape as the admin
  equivalent). Errors: `400` (contract not found), `401`, `403`.

---

## `DELETE /{id}/clusters/{ccID}` — remove a cluster

- **Auth:** token. **Path:** `id` (int64), `ccID` (int64, contract-cluster ID). Both
  required. **Query:** `org` (optional).
- **Response:** `200 OK`. Errors: `401`, `403`.

---

## `POST /{id}/clusters/{ccID}/issue-license` — issue full license

Issue a full (offline-capable) license for one of the caller's contract clusters.

- **Auth:** token plus authorization (`issue-license:cluster`).
- **Path:** `id` (int64), `ccID` (int64). Both required. **Query:** `org` (optional).
- **Response:** `200 OK` — a license object (`{ contract { id, startTimestamp,
  expiryTimestamp }, license }`, same shape as
  [`POST /license/issue`](../registration.md)). Errors: `401`, `403`
  (quota exceeded or authorization denied), `404`, `405` (revoked contract or offline
  not allowed).

---

## `PATCH /{id}/clusters/{ccID}/name` — rename a contract cluster

- **Auth:** token. **Path:** `id` (int64), `ccID` (int64). Both required. **Query:** `org` (optional).
- **Request body** (`application/json`): `{ "clusterName": "prod-east" }`.
- **Response:** `200 OK`. Errors: `401`, `403`, `422`.

---

## `PATCH /{id}/clusters/{ccID}/tags` — retag a contract cluster

Replace the tag set for a cluster and sync it across the owner's contracts sharing the
same cluster UUID.

- **Auth:** token. **Path:** `id` (int64), `ccID` (int64). Both required. **Query:** `org` (optional).
- **Request body** (`application/json`): `{ "tags": ["prod", "east"] }`.
- **Response:** `200 OK`. Errors: `401`, `403`, `422`.
