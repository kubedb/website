---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-multicluster-ocm-cluster-sets
    name: Cluster Sets & Feature Sets
    parent: api-multicluster-ocm
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster Sets & Feature Sets

Cluster sets group managed (spoke) clusters so that feature sets can be installed and
kept in sync across them, and so that namespaces can be bound to a set. All paths on
this page are relative to the `/api/v1` prefix and are hub-scoped:
`/api/v1/clusters/{owner}/{cluster}/...` where `owner` is an organization or user
slug and `{cluster}` is the OCM hub cluster (for example `ace`). Every endpoint
requires a personal access token (`Authorization: token <YOUR_TOKEN>`) and authorizes
the caller against the owner and cluster.

Common path parameters:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization or user slug that owns the cluster. |
| `cluster` | string | Hub cluster name. |
| `clusterset` | string | Cluster set name (on the routes that include it). |

Example call:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/clustersets
```

## Discovering cluster sets

### GET /clusters/{owner}/{cluster}/clustersets

List the cluster sets on the hub, with a cluster count for each.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — array of `ListClusterSetResp`.

```json
[
  { "clusterSetName": "cp-dbaas-generic", "clusterSetTitle": "Generic DBaaS", "clusters": 1 },
  { "clusterSetName": "cp-observability-cluster", "clusterSetTitle": "Observability Cluster", "clusters": 1 },
  { "clusterSetName": "global", "clusterSetTitle": "", "clusters": 2 }
]
```

Fields: `clusterSetName`, `clusterSetTitle` (human title, may be empty), `clusters`
(cluster count).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/available-clusters

List managed clusters available for use by the owner. (Documented in full on the
[Hubs & Spokes](../hubs-spokes.md) page; returns
`ManagedClusterInfo[]`.)

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/available-clustersets

List the cluster set names available for use by the owner.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `type` | string | No | Filter mode. When `client-org`, cluster sets are further filtered for client-org eligibility. |

- **Response:** `200` — array of cluster set names (strings).

```json
["cp-dbaas-generic", "cp-observability-cluster", "global"]
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Managing cluster sets

The create/delete/add/remove endpoints all share the `ClusterSetOptions` request
body:

| Field | Type | Required | Description |
|---|---|---|---|
| `clusters` | string[] | Depends | Managed cluster names to operate on. |
| `clusterSet` | string | Yes | Target cluster set name. |

### POST /clusters/{owner}/{cluster}/clustersets/create

Create a new cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ClusterSetOptions`.

```json
{ "clusterSet": "cp-dbaas-generic", "clusters": [] }
```

- **Response:** `200` — cluster set created. `422` on validation error.

### POST /clusters/{owner}/{cluster}/clustersets/delete

Delete a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ClusterSetOptions` (`clusterSet` identifies the set).
- **Response:** `200` — cluster set deleted. `422` on validation error.

### POST /clusters/{owner}/{cluster}/clustersets/add

Add clusters to a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ClusterSetOptions`.

```json
{ "clusterSet": "cp-dbaas-generic", "clusters": ["arnob-dev"] }
```

- **Response:** `200` — clusters added to the cluster set. `422` on validation error.

### POST /clusters/{owner}/{cluster}/clustersets/remove

Remove clusters from a cluster set. Same `ClusterSetOptions` body as `add`.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ClusterSetOptions`.
- **Response:** `200` — clusters removed from the cluster set. `422` on validation
  error.

## Cluster set contents

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/clusters

List the clusters belonging to a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — array of `ClustersResp`.

```json
[
  {
    "name": "arnob-dev",
    "displayName": "arnob-dev",
    "clusterNode": 1,
    "provider": "Generic",
    "kubernetesVersion": "v1.36.2+k3s1",
    "imported": true
  }
]
```

Fields: `name`, `displayName`, `clusterNode` (node count), `provider`,
`kubernetesVersion`, `imported`.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/clusterlist

List managed cluster names that can be *added* to the cluster set (candidates not
yet in it).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — array of managed cluster names (strings).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/auth-info

Get authorization info for a cluster set: a map of role-ref name to the list of users
granted that role.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — a free-form object mapping role-ref name to a list of users.
  The values are the internal user model, so the response is modeled as an arbitrary
  object rather than a fixed schema.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Feature sets

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/featuresets

List the feature sets available for a cluster set, including whether each is
installed.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — array of `FeatureSetInfo`.

```json
[
  {
    "name": "opscenter-monitoring",
    "title": "Monitoring",
    "description": "Prometheus-based monitoring stack",
    "recommended": true,
    "installed": false,
    "requiredFeatures": ["kube-prometheus-stack"],
    "features": [
      {
        "name": "kube-prometheus-stack",
        "title": "Kube Prometheus Stack",
        "description": "",
        "recommended": true,
        "installed": false,
        "featureBlock": "monitoring"
      }
    ]
  }
]
```

Feature-set fields: `name`, `title`, `description`, `recommended`, `installed`,
`requiredFeatures` (string[]), and `features` (array of feature objects with `name`,
`title`, `description`, `recommended`, `installed`, `featureBlock`).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### POST /clusters/{owner}/{cluster}/clustersets/{clusterset}/install-featureset

Install a feature set on a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Request body:** a free-form Helm values / model object (`map[string]any`)
  describing the feature set to install. The body is passed through as an arbitrary
  Kubernetes/Helm object, so its exact fields depend on the feature set — refer to
  the feature set's chart values.
- **Response:** `200` — feature set installed on the cluster set. `422` on validation
  error.

### POST /clusters/{owner}/{cluster}/clustersets/{clusterset}/disable-featureset

Disable a feature set on a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Request body:** `EnableFeatureOptions`.

```json
{
  "clusterSet": "cp-dbaas-generic",
  "featureSet": "opscenter-monitoring",
  "features": ["kube-prometheus-stack"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterSet` | string | Yes | Cluster set name. |
| `featureSet` | string | Yes | Feature set to disable. |
| `features` | string[] | No | Specific features within the set to disable. |

- **Response:** `200` — feature set disabled on the cluster set. `422` on validation
  error.

### POST /clusters/{owner}/{cluster}/clustersets/{clusterset}/{managedCluster}/update-featureset

Update the profile binding / feature set for a single managed cluster in the set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`, plus `managedCluster` (the
  managed cluster name).
- **Request body:** a free-form Helm values / model object (`map[string]any`)
  describing the feature set update. Passed through as an arbitrary Kubernetes/Helm
  object.
- **Response:** `200` — managed cluster profile binding updated. `422` on validation
  error.

## Feature sync status

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/sync-status/all-features

Get the sync status of all features in a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — a free-form nested object mapping feature set → feature →
  sync status (in-sync and unaligned cluster names). Modeled as an arbitrary object.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/sync-status/opscenter-features-version

Get the `opscenter-features` version sync status for a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — an object with the cluster set version and a per-cluster
  version list.

```json
{
  "clusterSetVersion": "v2026.6.19",
  "clusters": [
    { "name": "arnob-dev", "version": "v2026.6.19" }
  ]
}
```

Fields: `clusterSetVersion`, and `clusters` (array of `{ name, version }`).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/sync-status/{feature}

Get the sync status of a single feature in a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`, plus `feature` (the feature
  name).
- **Response:** `200` — in-sync and out-of-sync cluster names for the feature.

```json
{
  "insyncClusters": ["arnob-dev"],
  "outOfSyncClusters": []
}
```

Fields: `insyncClusters` (string[]), `outOfSyncClusters` (string[]).

## Auto-update

### GET /clusters/{owner}/{cluster}/clustersets/{clusterset}/auto-update/check

Check whether auto-update is possible for a cluster set (all spoke clusters on the
latest version).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Response:** `200` — an object indicating whether auto-update is possible.

```json
{ "possible": false }
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### POST /clusters/{owner}/{cluster}/clustersets/{clusterset}/auto-update

Trigger auto-update of a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `clusterset`.
- **Request body:** none.
- **Response:** `200` — cluster set auto-update triggered. `400` when auto-update is
  not possible (spoke clusters not on the latest version); the body is an `APIError`
  with a `message`.

## Namespace bindings

### GET /clusters/{owner}/{cluster}/bound-namespaces

List namespaces and the cluster sets bound to each.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — an object mapping namespace name to an array of bound cluster
  set names.

```json
{
  "default": [],
  "open-cluster-management-addon": ["global"]
}
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### POST /clusters/{owner}/{cluster}/bound-namespaces/bind

Bind a namespace to a cluster set.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `BindNamespaceOptions`.

```json
{ "clusterSet": "global", "namespace": "open-cluster-management-addon" }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterSet` | string | Yes | Cluster set to bind. |
| `namespace` | string | Yes | Namespace to bind it to. |

- **Response:** `200` — namespace bound to the cluster set. `422` on validation
  error.

### POST /clusters/{owner}/{cluster}/bound-namespaces/unbind

Unbind a namespace from a cluster set. Same `BindNamespaceOptions` body as `bind`.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `BindNamespaceOptions`.
- **Response:** `200` — namespace unbound from the cluster set. `422` on validation
  error.
