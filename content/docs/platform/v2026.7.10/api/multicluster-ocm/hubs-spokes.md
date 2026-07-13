---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-multicluster-ocm-hubs-spokes
    name: Hubs & Spokes
    parent: api-multicluster-ocm
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Hubs & Spokes

Hub-cluster discovery and spoke (managed) cluster lifecycle for Open Cluster
Management. All paths on this page are relative to the `/api/v1` prefix and are
scoped to an owner and a hub cluster:

- Owner-scoped: `/api/v1/clusters/{owner}/...`
- Hub-scoped: `/api/v1/clusters/{owner}/{cluster}/...`

`owner` is an organization or user slug; `{cluster}` is the OCM hub cluster name
(for example `ace`). Every endpoint requires a personal access token
(`Authorization: token <YOUR_TOKEN>`) and authorizes the caller against the owner
and cluster.

Common path parameters:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization or user slug that owns the cluster. |
| `cluster` | string | Hub cluster name (the OCM control-plane cluster). |

Example call:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clusters/appscode/hubs
```

## Hub clusters

### GET /clusters/{owner}/hubs

List the OCM hub clusters (OCM / OCM-MC) owned by the owner.

- **Auth:** token. Authorizes the caller against `owner`.
- **Path parameters:** `owner` (see table above).
- **Response:** `200` — a JSON array of hub cluster summaries.

```json
[
  {
    "name": "ace",
    "displayName": "ace",
    "hubClusterUID": "<uid>",
    "spokeClusters": 2,
    "addOns": 0,
    "clusterNode": 1,
    "provider": "Generic",
    "hubType": "OCM",
    "locations": "",
    "age": "43m",
    "createdAt": "2026-07-05T06:49:31Z"
  }
]
```

Fields: `name`/`displayName` (hub cluster name), `ownerName`, `hubClusterUID`,
`spokeClusters` (count of registered spokes), `addOns`, `clusterNode` (node count),
`provider`, `hubType` (`OCM` or `OCM-MC`), `locations`, `age`, `createdAt`.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Spoke inventories

These endpoints read the spoke inventory from the hub cluster. Unless noted, they
return an array of `ManagedClusterInfo` objects:

| Field | Type | Description |
|---|---|---|
| `name` | string | Managed (spoke) cluster name. |
| `clusterURL` | string | API server URL of the spoke cluster. |
| `clusterUID` | string | Spoke cluster UID. |
| `clusterSet` | string | Cluster set the spoke belongs to (when set). |

### GET /clusters/{owner}/{cluster}/managed-clusters

List all OCM managed clusters. Returns the raw OCM `ManagedClusterList` object from
the hub cluster (an arbitrary Kubernetes list object, passed through verbatim).

- **Auth:** token. Authorizes the caller against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — a Kubernetes `ManagedClusterList` object. See the
  [OCM ManagedCluster concept](https://open-cluster-management.io/) for the object
  shape; it is not reshaped by the API.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/not-accepted-clusters

List managed clusters that have registered with the hub but have not yet been
accepted.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — array of `ManagedClusterInfo` (see table above).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/accepted-clusters

List managed clusters that have been accepted by the hub.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — array of `ManagedClusterInfo`.

```json
[
  {
    "name": "arnob-dev",
    "clusterURL": "https://10.2.0.168:6443",
    "clusterUID": "<uid>"
  },
  {
    "name": "arnob-monitoring",
    "clusterURL": "https://10.2.0.136:6443",
    "clusterUID": "<uid>"
  }
]
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/available-clusters

List managed clusters available for use by the owner (the subset the owner is
entitled to consume).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — array of `ManagedClusterInfo`.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Profile validation

### GET /clusters/{owner}/{cluster}/validate-profile

Validate the spoke clusters' feature sets against a cluster profile.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `profile` | string | No | Cluster profile to validate against. Defaults to `dbaas-generic`. |

- **Response:** `200` — a free-form object. Contains `valid` (the string `"true"` or
  `"false"`) and, when invalid, a `recommended-features` list.

```json
{
  "valid": "true"
}
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Accepting & importing spokes

### POST /clusters/{owner}/{cluster}/accept-spoke

Accept one or more spoke cluster join requests on the hub.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `AcceptOptions`.

```json
{
  "clusters": ["arnob-dev", "arnob-monitoring"],
  "skipApproveCheck": false,
  "requesters": ["system:open-cluster-management:arnob-dev"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusters` | string[] | Yes | Names of the managed clusters to accept. |
| `skipApproveCheck` | boolean | No | Skip the CSR approval check when accepting. |
| `requesters` | string[] | No | Requester identities whose CSRs should be approved. |

- **Response:** `200` — spoke cluster join requests accepted. `422` on validation
  error.

### POST /clusters/{owner}/{cluster}/spoke-command

Generate the install command a spoke cluster runs to register with this hub.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ClusterOptions` — identifies the spoke and its hub. Key fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterName` | string | Yes | Name of the spoke cluster to create/import. |
| `hostClusterName` | string | No | Host cluster name (for virtual clusters). |
| `hostClusterUID` | string | No | Host cluster UID. |
| `hostClusterOwnerID` | integer | No | Owner ID of the host cluster. |
| `hubClusterName` | string | No | Hub cluster name. |
| `hubClusterUID` | string | No | Hub cluster UID. |
| `hubClusterOwnerID` | integer | No | Owner ID of the hub cluster. |

```json
{
  "clusterName": "arnob-dev",
  "hubClusterName": "ace",
  "hubClusterUID": "<uid>"
}
```

- **Response:** `200` — an object with the generated command.

```json
{
  "spoke": "helm upgrade -i ... # spoke registration command"
}
```

### POST /clusters/{owner}/{cluster}/import-spoke

Accept and import a spoke cluster in one step (registers the cluster and installs
the requested components).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ImportOptions`.

```json
{
  "basicInfo": {
    "name": "arnob-dev",
    "displayName": "arnob-dev",
    "clusterUID": "<uid>",
    "infraNamespace": "kubeops"
  },
  "provider": {
    "name": "Generic",
    "credential": "",
    "kubeConfig": "<kubeconfig>"
  },
  "components": {
    "fluxCD": true,
    "allFeatures": false,
    "clusterProfile": "dbaas-generic",
    "spokeComponent": true
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `basicInfo` | object | Yes | Identity of the cluster: `name`, `displayName`, `ownerID`, `managerID`, `userID`, `clusterUID`, `hubClusterID`, `infraNamespace`. |
| `provider` | object | No | Provider details: `name`, `credential`, `eksAuthMode` (`IRSA`/`PodIdentity`), `clusterID`, `project`, `region`, `resourceGroup`, `kubeConfig`. |
| `components` | object | No | What to install: `fluxCD`, `featureSets`, `allFeatures`, `clusterProfile`, `monitoringClusterName`, `spokeComponent`. |

- **Response:** `200` — cluster import by OCM submitted. `422` on validation error.

### POST /clusters/{owner}/{cluster}/convert/spoke

Convert an existing (already-imported) cluster into an OCM spoke cluster. Uses the
same `ImportOptions` request body as `import-spoke`.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `ImportOptions` (see `import-spoke` above).
- **Response:** `200` — cluster converted to a spoke cluster. `422` on validation
  error.

### POST /clusters/{owner}/{cluster}/remove-managed-cluster

Remove a managed cluster from the hub (uninstalls the spoke agent).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `RemoveClusterOptions`.

```json
{
  "clusterName": "arnob-dev"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterName` | string | Yes | Name of the managed cluster to remove. |

- **Response:** `200` — managed cluster removed. `422` on validation error.

## Account sync

### POST /clusters/{owner}/{cluster}/sync-accounts

Sync account objects (users and groups) from the platform to the hub cluster so that
OCM RBAC reflects the current accounts.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** none.
- **Response:** `200` — account objects synced.
