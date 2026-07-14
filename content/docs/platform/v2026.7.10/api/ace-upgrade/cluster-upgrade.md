---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-upgrade-cluster-upgrade
    name: Cluster Upgrade
    parent: api-ace-upgrade
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster Upgrade

Endpoints for upgrading the KubeDB Platform feature stack running inside a member cluster.
There are two flavours:

- **Imported cluster** routes (`/clusters/{owner}/{cluster}/upgrade*`) upgrade the
  `opscenter-features` Helm release and its managed features in the target
  cluster.
- **Spoke cluster** routes (`/clusters/{owner}/{cluster}/spoke/upgrade*`) upgrade
  a spoke cluster by updating its managed cluster profile binding to the hub's
  `opscenter-features` version. Spoke status/history are read from the hub
  cluster's upgrader `ConfigMap`.

Paths below are relative to the API root `/api/v1` (so
`/clusters/{owner}/{cluster}/upgrade` means
`https://<akp-host>/api/v1/clusters/{owner}/{cluster}/upgrade`).

**Authentication & authorization.** All routes require a personal access token
(`Authorization: token <YOUR_TOKEN>`). Access is gated by **cluster assignment**
for the given `owner`/`cluster` (the server also needs a runtime client to that
cluster). A caller without an assignment to the cluster receives `403`. Unlike
the platform upgrade routes, these do **not** use site-admin org authorization and
do not take an `org` query parameter — the owner is part of the path.

The upgrade status and history responses are dynamic key/value maps read from an
upgrader `ConfigMap` — the exact keys depend on the cluster's installer and are
not a fixed schema.

## Path parameters

These apply to every endpoint on this page.

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization slug or username that owns the cluster. |
| `cluster` | string | Cluster name within the owner scope. |

---

## GET /clusters/{owner}/{cluster}/upgrade

Returns the most recent upgrade status for an imported cluster, read from the
latest upgrader `ConfigMap` data in that cluster. The response is a dynamic
key/value map.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.** A free-form JSON object (arbitrary `ConfigMap` `data`
keys). Example shape:

```json
{
  "status": "completed",
  "version": "v2026.6.19"
}
```

Returns `400` when no upgrade status is recorded in the cluster yet.

> **Verified:** `GET /clusters/appscode/ace/upgrade` returned `400` against
> `appscode/ace` (hub) ("no upgrade status found") — no feature-stack upgrade has
> been run on this cluster, so there is no upgrader ConfigMap. On 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/upgrade
```

---

## GET /clusters/{owner}/{cluster}/upgrade/history

Returns the upgrade history for an imported cluster as a list of `ConfigMap` data
maps.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.** A JSON array of dynamic key/value maps. Example:

```json
[
  {
    "status": "completed",
    "version": "v2026.6.19"
  }
]
```

> **Verified:** `GET /clusters/appscode/ace/upgrade/history` returned `200`
> against `appscode/ace` (hub) (empty list `[]`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/upgrade/history
```

---

## GET /clusters/{owner}/{cluster}/upgrade/current-version

Returns the currently installed `opscenter-features` chart version in an imported
cluster.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.**

```json
{
  "version": "v2026.6.19"
}
```

| Field | Type | Description |
|---|---|---|
| `version` | string | Currently installed `opscenter-features` chart version in the cluster. |

> **Verified:** `GET /clusters/appscode/ace/upgrade/current-version` returned
> `200` against `appscode/ace` (hub) (`{"version":"v2026.6.19"}`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/upgrade/current-version
```

---

## GET /clusters/{owner}/{cluster}/upgrade/latest-version

Returns the latest available `opscenter-features` chart version from the server —
the target used for imported-cluster upgrades.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.**

```json
{
  "version": "v2026.6.19"
}
```

| Field | Type | Description |
|---|---|---|
| `version` | string | Latest available chart version the cluster can be upgraded to. |

> **Verified:** `GET /clusters/appscode/ace/upgrade/latest-version` returned `200`
> against `appscode/ace` (hub) (`{"version":"v2026.6.19"}`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/upgrade/latest-version
```

---

## POST /clusters/{owner}/{cluster}/upgrade

Triggers an upgrade of the `opscenter-features` Helm release and managed features
in an imported cluster to the server's current version. Runs asynchronously;
progress is tracked in an upgrader `ConfigMap` (poll
`GET /clusters/{owner}/{cluster}/upgrade`).

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.
- **Request body:** none.

**Response.** `200` when the upgrade has started. Returns `403` when the cluster
is not assigned to the caller.

```
curl -X POST -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/upgrade
```

> Not verified live: this is a mutating (`POST`) endpoint and is documented from
> the schema only.

---

## GET /clusters/{owner}/{cluster}/spoke/upgrade

Returns the most recent upgrade status for a spoke cluster, read from the hub
cluster's upgrader `ConfigMap` data for that spoke. The response is a dynamic
key/value map.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.** A free-form JSON object (arbitrary `ConfigMap` `data`
keys). Example shape:

```json
{
  "status": "completed",
  "version": "v2026.6.19"
}
```

Returns `400` when no upgrade status is recorded for the spoke yet.

> **Verified:** `GET /clusters/appscode/arnob-dev/spoke/upgrade` returned `400`
> against `appscode/arnob-dev` (spoke) ("no upgrade status found") — no spoke
> upgrade recorded on the hub for this cluster. On 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/arnob-dev/spoke/upgrade
```

---

## GET /clusters/{owner}/{cluster}/spoke/upgrade/history

Returns the upgrade history for a spoke cluster as a list of `ConfigMap` data maps
(read from the hub cluster).

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.

**Response — `200 OK`.** A JSON array of dynamic key/value maps. Example:

```json
[
  {
    "status": "completed",
    "version": "v2026.6.19"
  }
]
```

> **Verified:** `GET /clusters/appscode/arnob-dev/spoke/upgrade/history` returned
> `200` against `appscode/arnob-dev` (spoke) (empty list `[]`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/arnob-dev/spoke/upgrade/history
```

---

## POST /clusters/{owner}/{cluster}/spoke/upgrade

Triggers an upgrade of a spoke cluster by updating its managed cluster profile
binding and related features to the hub's `opscenter-features` version. Runs
asynchronous post-processing.

- **Auth:** token; cluster assignment for `{owner}/{cluster}`.
- **Request body:** none.

**Response.** `200` when the spoke upgrade has started. Returns `403` when the
cluster is not assigned to the caller.

```
curl -X POST -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/arnob-dev/spoke/upgrade
```

> Not verified live: this is a mutating (`POST`) endpoint and is documented from
> the schema only.
