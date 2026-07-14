---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v1-lifecycle
    name: Cluster Lifecycle & Info
    parent: api-cluster-management-v1
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster Lifecycle & Info

Manage the lifecycle of an imported cluster and read information about it. All paths
on this page are relative to:

```
/api/v1/clusters/{owner}/{cluster}
```

All endpoints require a token (`Authorization: token <YOUR_TOKEN>`). `{owner}` is the
organization slug or username that owns the cluster, and `{cluster}` is the cluster
name. Common path parameters used throughout this page:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization slug or username that owns the cluster. |
| `cluster` | string | Cluster name. |

A documented call looks like:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/
```

---

## Cluster details

### GET /clusters/{owner}/{cluster}/

Get summary information about a cluster.

- **Auth:** token.
- **Response:** `200` with a `ClusterInfo` object.

```json
{
  "id": 2,
  "displayName": "ace",
  "name": "ace",
  "uid": "<uid>",
  "ownerID": 3,
  "externalID": "",
  "ownerName": "appscode",
  "provider": "Generic",
  "vendor": "",
  "infraNamespace": "",
  "isMonitoringCluster": false,
  "endpoint": "https://<akp-host>:6443",
  "location": "",
  "project": "",
  "kubernetesVersion": "v1.36.2+k3s1",
  "nodeCount": 1,
  "createdAt": "2026-07-05T06:49:31Z",
  "age": "8d",
  "clusterManagers": ["ACE", "OCMHub"],
  "status": { "response": { "phase": "Active" } }
}
```

Key fields: `name`/`displayName`/`uid` identify the cluster, `ownerName`/`ownerID`
the owning account, `provider`/`vendor`/`kubernetesVersion`/`nodeCount` describe the
Kubernetes cluster, `clusterManagers` lists the managers (e.g. `ACE`, `OCMHub`,
`Rancher`), and `status` is a Kubernetes-style `ClusterStatus` object.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) and `appscode/arnob-dev` (spoke) on 2026-07-14.

### PUT /clusters/{owner}/{cluster}/

Update an imported cluster's import options (display name, provider, kubeconfig).

- **Auth:** token + `authzCheck(update:cluster)` (Cluster_Editor).
- **Request body:** an `ImportClusterOption`.

```json
{
  "displayName": "my-cluster",
  "name": "my-cluster",
  "provider": "Generic",
  "kubeConfig": "<kubeconfig>"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `displayName` | string | no | Human-friendly name. |
| `name` | string | no | Cluster name. |
| `provider` | string | yes | Cluster provider (e.g. `Generic`, `GKE`, `EKS`). |
| `kubeConfig` | string | yes | Raw kubeconfig for the cluster. |

- **Response:** `200` with the persisted cluster info model (`ClusterInfoModel`, an
  open/DB-backed object).

### DELETE /clusters/{owner}/{cluster}/

Submit a cluster deletion command as an async task. Returns the command to run rather
than deleting synchronously.

- **Auth:** token + `authzCheck(delete:cluster)` (Cluster_Editor).
- **Response:** `200` with a `TaskResponse`.

```json
{ "id": "task-1a2b3c", "subject": "tasks.cluster.delete" }
```

### POST /clusters/{owner}/{cluster}/remove

Remove a cluster's registration from the KubeDB Platform (does not delete the underlying cluster).

- **Auth:** token.
- **Response:** `200` with an empty body.

---

## Cluster access & discovery

### GET /clusters/{owner}/{cluster}/client-config

Get the cluster's client kubeconfig, returned as a JSON string.

- **Auth:** token + `authzCheck(view:kube-config)` (Cluster_CanViewKubeconfig).
- **Response:** `200` with the kubeconfig as a JSON-encoded string.

```json
"apiVersion: v1\nkind: Config\nclusters:\n- cluster: { ... }\n..."
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/available-types

Discover the resource types available in the cluster. Returns a nested mapping of
`group -> version -> [ { Kind, Resource } ]`.

- **Auth:** token.
- **Response:** `200` with a dynamic object.

```json
{
  "": {
    "v1": [
      { "Kind": "ConfigMap", "Resource": "configmaps" },
      { "Kind": "Pod", "Resource": "pods" },
      { "Kind": "Endpoints", "Resource": "endpoints" }
    ]
  },
  "apps": {
    "v1": [
      { "Kind": "Deployment", "Resource": "deployments" }
    ]
  }
}
```

The empty-string key (`""`) is the legacy Kubernetes core group.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) and `appscode/arnob-dev` (spoke) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/is-server

Check whether this cluster is the KubeDB Platform hub cluster.

- **Auth:** token.
- **Response:** `200` with `{"server": "yes"|"no"}`.

```json
{ "server": "yes" }
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub, `"server":"yes"`) on 2026-07-14.

---

## Database & features

### GET /clusters/{owner}/{cluster}/db-status

Get a dynamic map of database feature gates / status for the cluster.

- **Auth:** token.
- **Response:** `200` with a dynamic map (empty `{}` when no DB features are present).

```json
{}
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/db-bundle

Get database bundle information — a dynamic map of string to an array of strings.

- **Auth:** token.
- **Response:** `200` with a dynamic map.

```json
{
  "kubedb": ["MongoDB", "PostgreSQL", "MySQL"]
}
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/feature/factory-values

Get the factory (default) values for one or more features.

- **Auth:** token.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `features` | string | yes | Feature name(s) to fetch default values for. |

- **Response:** `200` with a dynamic map of factory feature values.

> **Verified:** `GET` returned `200` against `appscode/ace` with `?features=kubedb`;
> returned `400` (`missing features query parameter`) when the `features` query
> parameter is omitted, on 2026-07-14.

### POST /clusters/{owner}/{cluster}/update-presets/{preset}

Update the named preset in a spoke cluster by applying the supplied FluxCD
`HelmRelease` object.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `preset` (string, the preset name).
- **Request body:** an arbitrary FluxCD `HelmRelease` Kubernetes object. See the
  [Kubernetes proxy](../kubernetes-proxy.md) page for how
  arbitrary Kubernetes objects are passed through verbatim.
- **Response:** `200` with an empty body.

---

## Commands & resources

### POST /clusters/{owner}/{cluster}/execute-command

Run one of the whitelisted `kubectl` plugin commands against the cluster
(`kubectl-kubestash`, `kubectl-stash`, `kubectl-dba`, `kubectl-vault`).

- **Auth:** token.
- **Request body:** an `ExecuteCommandPayload`.

```json
{ "command": "kubectl-dba version --client" }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `command` | string | yes | The whitelisted command to execute. |

- **Response:** `200` with a `CommandResponse`.

```json
{ "stdout": "kubectl-dba version ...", "stderr": "" }
```

Returns `422` for an invalid or unsupported command.

### POST /clusters/{owner}/{cluster}/resources

Create a generic Kubernetes resource in the cluster.

- **Auth:** token.
- **Request body:** the raw YAML/JSON of any Kubernetes object (parsed into an
  unstructured object). This is an arbitrary Kubernetes object rather than a fixed
  schema.

```json
{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": { "name": "example", "namespace": "default" },
  "data": { "key": "value" }
}
```

- **Response:** `200` with the created Kubernetes object.

---

## Deploy orders

### POST /clusters/{owner}/{cluster}/deploy/{id}

Install a previously generated product deploy order (`order.yaml` identified by
`{id}`) into the cluster. No request body.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `id` (string, the deploy order ID).
- **Response:** `200` (empty body). `404` if the deploy order is not found.

### DELETE /clusters/{owner}/{cluster}/deploy/{id}

Uninstall the product deploy order identified by `{id}` from the cluster. No request
body.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `id` (string, the deploy order ID).
- **Response:** `200` (empty body). `404` if the deploy order is not found.

---

## Resource history

### GET /clusters/{owner}/{cluster}/resource-history

Get the change history for resources from NATS, optionally filtered by query
parameters.

- **Auth:** token.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `product` | string | no | Filter by product. |
| `group` | string | no | Filter by Kubernetes API group. |
| `resource` | string | no | Filter by resource (plural). |
| `rid` | string | no | Filter by resource ID. |

- **Response:** `200` with a `BadgerEntryList`.

```json
{
  "items": [
    {
      "key": "kubedb.com/mongodbs/<uid>",
      "values": [
        {
          "resourceID": { "group": "kubedb.com", "kind": "MongoDB", "name": "mongo-1" },
          "licenseID": "<license-id>",
          "version": 3,
          "timestamp": 1783967505
        }
      ],
      "lastSeen": 1783967505
    }
  ]
}
```

Each entry has a `key`, one or more `values` (each carrying the `resource`,
`resourceID`, `licenseID`, `version`, and `timestamp`), and a `lastSeen` timestamp.

> **Verified:** returned `500` (`nats: no responders available for request`) against
> `appscode/ace` — this endpoint depends on the NATS resource-history responder,
> which was not available on the verification cluster.
