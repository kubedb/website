---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v2-clusters
    name: Clusters
    parent: api-cluster-management-v2
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Clusters (v2)

Cluster lifecycle and hub-aware operations under `/api/v1/clustersv2`. All paths on this
page are relative to `/api/v1`; the full path for the first endpoint, for example, is
`/api/v1/clustersv2/providers/{provider}/skip-credentials`.

Common conventions:

- **owner** — the organization slug or username that owns the cluster (e.g. `appscode`).
- **cluster** — the cluster name within that owner's scope (e.g. `ace`, `arnob-dev`,
  `arnob-monitoring`).
- **Auth** — every endpoint requires a token unless noted; send it as
  `Authorization: token <YOUR_TOKEN>` (or a `token` / `access_token` query parameter).
- **K8s object responses** — some endpoints return an arbitrary Kubernetes object or
  list (for example an `UnstructuredList` of `clusterprofiles`, a `ConfigMapList`, or a
  cluster `status`). These are passed through verbatim from the member cluster and are
  documented as opaque objects rather than fixed schemas.

Example request:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clustersv2/appscode/ace/status
```

---

## Provider & hub discovery

### GET /clustersv2/providers/{provider}/skip-credentials

Check whether manual cloud credentials can be skipped for a provider. Only EKS is
supported; it verifies the current environment has the AWS IAM permissions needed to skip
manual credentials.

**Auth:** token. Requires **site-admin** privileges
(`admin_of_administrative_org:site_admin`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| provider | string | Cloud provider identifier. Only `eks` is supported. |

**Response:** `200` when credentials can be skipped, `400` when they cannot (unsupported
provider or insufficient permissions). Both return a `SkipCredentialsResponse`:

```json
{
  "skipCredentials": true,
  "reason": "",
  "message": "IAM permissions verified"
}
```

| Field | Type | Description |
|---|---|---|
| skipCredentials | boolean | Whether credentials can be skipped. |
| reason | string | Machine-readable reason (when not skippable). |
| message | string | Human-readable detail. |

> **Verified:** `GET` returned `400` for `providers/eks/skip-credentials` on 2026-07-14 — this KubeDB Platform instance is not an EKS environment with the required IAM permissions, which is the expected non-skippable outcome.

---

### GET /clustersv2/all-hubs

List all hub clusters owned by the user across their organizations.

**Auth:** token.

**Response:** `200` — an array of `HubCluster`. `400` if the user owns no organization.

```json
[
  {
    "name": "ace",
    "ownerName": "appscode",
    "displayName": "ace",
    "hubClusterUID": "<uid>",
    "spokeClusters": 0,
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

| Field | Type | Description |
|---|---|---|
| name | string | Hub cluster name. |
| ownerName | string | Owner (org/user) name. |
| displayName | string | Display name. |
| hubClusterUID | string | Hub cluster UID. |
| spokeClusters | integer | Number of spoke clusters. |
| addOns | integer | Number of add-ons installed. |
| clusterNode | integer | Node count. |
| provider | string | Cloud/infra provider. |
| hubType | string | Hub type (e.g. `OCM`). |
| locations | string | Locations summary. |
| age | string | Human-readable age. |
| createdAt | string (date-time) | Creation timestamp. |

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (one hub, `ace`).

---

### GET /clustersv2/{owner}/hub-info

Get hub cluster connection info (API server and token) for the owner's OCM hub clusters.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Response:** `200` — a map keyed by cluster name; each value contains `apiServer` and a
bearer `token`. `400` if listing OCM manager clusters fails.

```json
{
  "ace": {
    "apiServer": "https://<akp-host>:6443",
    "token": "<bearer-token>"
  }
}
```

> **Note:** the `token` value is a live service-account bearer token — treat it as a
> secret.

> **Verified:** `GET` returned `200` against `appscode` (hub `ace`) on 2026-07-14.

---

### GET /clustersv2/{owner}/has-hub

Check whether the owner has any hub cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Response:** `200` — `{ "has-hub": <bool> }`. `400` if listing OCM manager clusters
fails.

```json
{ "has-hub": true }
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (`{"has-hub":true}`).

---

### GET /clustersv2/cluster-profiles

List available cluster profiles.

**Auth:** token.

**Response:** `200` — an `UnstructuredList` of `clusterprofiles`
(`meta.k8s.appscode.com/v1alpha1`). This is an arbitrary Kubernetes list object; see the
[cluster features guide](../../../guides/cluster-management/cluster-features.md) for how
profiles are used.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

---

### GET /clustersv2/identity/{clusterID}

Get cluster identity metadata by cluster UID.

**Auth:** token. (Used for cross-cluster identity resolution; intended for
platform/admin flows.)

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| clusterID | string | Cluster UID. |

**Response:** `200` — a `ClusterMetadata` object. `404` if the cluster info is not found.

```json
{
  "uid": "<uid>",
  "name": "ace",
  "displayName": "ace",
  "provider": "Generic",
  "ownerID": "3",
  "ownerType": "org",
  "apiEndpoint": "https://<akp-host>:6443",
  "caBundle": "<base64-ca>",
  "managerID": "",
  "hubClusterID": "<uid>",
  "cloudServiceAuthMode": "",
  "mode": "prod"
}
```

| Field | Type | Description |
|---|---|---|
| uid | string | Cluster UID. |
| name | string | Cluster name. |
| displayName | string | Display name. |
| provider | string | Provider. |
| ownerID | string | Owner ID. |
| ownerType | string | Owner type (org/user). |
| apiEndpoint | string | Kubernetes API server endpoint. |
| caBundle | string | Base64-encoded CA bundle. |
| managerID | string | Managing cluster ID. |
| hubClusterID | string | Hub cluster UID. |
| cloudServiceAuthMode | string | Cloud service auth mode. |
| mode | string | One of `prod`, `qa`, `staging`, `dev`. |

> **Verified:** `GET` returned `404` for the hub cluster UID on 2026-07-14 — the identity
> registry lookup is keyed differently from the imported-cluster list, so this UID is not
> resolvable here on this instance (the route itself is reachable and authorized).

---

## Listing & status

### GET /clustersv2/{owner}/all-clusters

List all imported clusters for an owner.

**Auth:** token. Requires **site-admin** privileges (`view_orgs:site_admin`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Response:** `200` — an array of `ClusterInfo` (see the schema under
[`GET /clustersv2/{owner}`](#get-clustersv2owner)).

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

---

### GET /clustersv2/{owner}

List clusters for an owner (each with a resolved provider).

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Response:** `200` — an array of `ClusterInfo`:

```json
[
  {
    "id": 2,
    "displayName": "ace",
    "name": "ace",
    "uid": "<uid>",
    "ownerID": 3,
    "ownerName": "appscode",
    "provider": "Generic",
    "vendor": "",
    "infraNamespace": "",
    "isMonitoringCluster": false,
    "endpoint": "https://<akp-host>:6443",
    "kubernetesVersion": "v1.36.2+k3s1",
    "nodeCount": 1,
    "createdAt": "2026-07-05T06:49:31Z",
    "age": "43m",
    "clusterManagers": ["ACE", "OCMHub"],
    "isCapiClusterUpgradeable": false,
    "status": { "response": { "phase": "Registered" } }
  }
]
```

| Field | Type | Description |
|---|---|---|
| id | integer (int64) | Internal cluster record ID. |
| displayName | string | Display name. |
| name | string | Cluster name. |
| uid | string | Cluster UID. |
| ownerID | integer (int64) | Owner ID. |
| managerID | integer (int64) | Managing cluster ID. |
| externalID | string | External (provider) ID. |
| hubClusterName / hubClusterUID / hubClusterOwnerName | string | Associated hub cluster. |
| clusterSetName | string | Cluster-set name. |
| ownerName | string | Owner (org/user) name. |
| provider | string | Provider (e.g. `Generic`, `eks`). |
| vendor | string | Kubernetes vendor. |
| infraNamespace | string | Infrastructure namespace. |
| isMonitoringCluster | boolean | Whether this is a monitoring cluster. |
| endpoint | string | Kubernetes API endpoint. |
| location / project | string | Location / project. |
| kubernetesVersion | string | Kubernetes version. |
| nodeCount | integer (int32) | Node count. |
| createdAt | string (date-time) | Creation time. |
| age | string | Human-readable age. |
| clusterManagers | string[] | Managers (e.g. `ACE`, `OCMHub`). |
| isCapiClusterUpgradeable | boolean | Whether a CAPI upgrade is available. |
| status | object | Kubernetes-style `ClusterStatus` (opaque). |

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

---

### GET /clustersv2/{owner}/{cluster}/exist

Check whether the cluster is imported for the given owner.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Response:** `200` — `{ "exist": <bool> }`.

```json
{ "exist": true }
```

> **Verified:** `GET` returned `200` against `appscode/arnob-dev` on 2026-07-14 (`{"exist":true}`).

---

### GET /clustersv2/{owner}/{cluster}/status

Get the current status of a cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Response:** `200` — a `ClusterInfo` with its `status` field resolved (same schema as
[`GET /clustersv2/{owner}`](#get-clustersv2owner)).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14; also
> `200` against `appscode/arnob-monitoring` (spoke).

---

## Lifecycle & reconciliation

### GET /clustersv2/{owner}/{cluster}/reconcile

Reconcile Helm releases for the specified features. Adds reconcile annotations to the
`HelmRelease` objects of the features passed in the `features` query parameter.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| features | string | No | Comma-separated list of feature names to reconcile. |

**Response:** `200` when reconcile is triggered. `400` if a feature or its `HelmRelease`
is not found.

> **Verified:** `GET` returned `500` against `appscode/ace` on 2026-07-14 when called
> with no `features` argument — the handler requires valid feature names to resolve
> `HelmRelease` objects.

---

### POST /clustersv2/{owner}/check

Check whether a cluster already exists / is importable.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Request body:** a `CheckOptions` object.

```json
{
  "basicInfo": {
    "name": "my-cluster",
    "displayName": "My Cluster",
    "clusterUID": "<uid>"
  },
  "provider": {
    "name": "eks",
    "credential": "aws-cred",
    "region": "us-east-1",
    "clusterID": "my-eks"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| basicInfo | object (`BasicInfo`) | No | Cluster basic info (name, displayName, ownerID, managerID, userID, clusterUID, hubClusterID, infraNamespace). |
| provider | object (`ProviderOptions`) | No | Provider details (name, credential, eksAuthMode `IRSA`/`PodIdentity`, clusterID, project, region, resourceGroup, kubeConfig). |

**Response:** `200` — a `ClusterInfo` describing existence / import status. `422` for an
invalid body.

---

### POST /clustersv2/{owner}/validate

Validate cluster import options.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| operation | string | No | Set to `connect` to skip Flux/feature-set detection. |

**Request body:** an `ImportOptions` object.

```json
{
  "basicInfo": { "name": "my-cluster", "displayName": "My Cluster" },
  "provider": { "name": "eks", "credential": "aws-cred", "region": "us-east-1" },
  "components": {
    "fluxCD": true,
    "allFeatures": false,
    "clusterProfile": "default",
    "featureSets": [ { "name": "opscenter-core", "features": ["kube-ui-server"] } ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| basicInfo | object (`BasicInfo`) | No | Cluster basic info. |
| provider | object (`ProviderOptions`) | No | Provider details. |
| components | object (`ComponentOptions`) | No | Components to install: `fluxCD` (bool), `featureSets` (array of `{name, features[]}`), `allFeatures` (bool), `clusterProfile` (string), `monitoringClusterName` (string), `spokeComponent` (bool). |

**Response:** `200` — a `ValidationResponse`:

```json
{
  "alreadyImported": false,
  "displayName": { "valid": true, "reason": "" },
  "clusterId": { "valid": true, "reason": "" },
  "message": "",
  "monitoringClusterList": ["arnob-monitoring"]
}
```

| Field | Type | Description |
|---|---|---|
| alreadyImported | boolean | Whether the cluster is already imported. |
| displayName / clusterId | object (`FieldValidation`) | Per-field `{valid, reason}`. |
| fluxCD / availableFeatureSets / clusterAPI | object | Opaque Kubernetes objects (detected state). |
| message | string | Validation message. |
| clusterMetadata | object (`ClusterMetadata`) | Detected cluster metadata. |
| monitoringClusterList | string[] | Candidate monitoring clusters. |

`422` for an invalid body.

---

### POST /clustersv2/{owner}/import

Import a cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Request body:** an `ImportOptions` object (same schema as
[`/validate`](#post-clustersv2ownervalidate)).

**Response:** `200` — the imported `ClusterInfo`. `422` for an invalid body.

---

### POST /clustersv2/{owner}/{cluster}/connect

Connect (or re-connect) to an already-imported cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| operation | string | No | Set to `re-connect` to update existing credentials. |

**Request body:** a `ConnectOptions` object.

```json
{
  "name": "my-cluster",
  "credential": "aws-cred",
  "kubeConfig": "<kubeconfig-yaml>"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | No | Cluster name. |
| credential | string | No | Stored cloud credential name. |
| kubeConfig | string | No | Kubeconfig contents. |

**Response:** `200` — `ClusterInfo` after connecting. `400` if connecting fails (e.g.
existing user auth on a non-reconnect), `422` for an invalid body.

---

### POST /clustersv2/{owner}/{cluster}/remove

Remove a cluster and its components.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| response-id | string | No | Optional response identifier for progress notifications. |
| notify | boolean | No | Whether to send progress notifications (defaults to `true`). |

**Request body:** a `RemovalOptions` object.

```json
{
  "name": "my-cluster",
  "components": { "fluxCD": true, "allFeatures": true }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | No | Cluster name. |
| components | object (`ComponentOptions`) | No | Components to remove. |

**Response:** `200` when the removal task is submitted. `422` for an invalid body.

---

### POST /clustersv2/{owner}/{cluster}/reconfigure

Reconfigure a cluster's components.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Request body:** a `ReconfigureOptions` object.

```json
{
  "basicInfo": { "name": "my-cluster" },
  "components": {
    "allFeatures": false,
    "featureSets": [ { "name": "opscenter-core", "features": ["kube-ui-server"] } ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| basicInfo | object (`BasicInfo`) | No | Cluster basic info. |
| components | object (`ComponentOptions`) | No | Components to reconfigure. |

**Response:** `200` — the internal cluster info record (modeled as a generic Kubernetes
object). `422` for an invalid body.

---

### POST /clustersv2/{owner}/{cluster}/feature/{feature}/convert

Convert a feature to be UI-managed.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |
| feature | string | Name of the feature to convert. |

**Response:** `200` when the feature is converted. `400` if the feature is not enabled or
already UI-managed.

---

## Kubernetes version upgrades

### GET /clustersv2/{owner}/{cluster}/update-version/operations

List cluster version update operations.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Response:** `200` — a `ConfigMapList` of upgrade operations (an arbitrary Kubernetes
list object).

> **Verified:** `GET` returned `200` against `appscode/ace` on 2026-07-14.

---

### GET /clustersv2/{owner}/{cluster}/update-version/list

List upgradeable Kubernetes versions for a cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Response:** `200` — an array of version strings.

```json
["v1.37.0", "v1.38.0"]
```

> **Verified:** `GET` returned `500` against `appscode/ace` on 2026-07-14 — `ace` is a
> k3s hub cluster, not a CAPI-managed cluster, so upgradeable-version discovery does not
> apply. This endpoint targets CAPI clusters.

---

### GET /clustersv2/{owner}/{cluster}/update-version/{version}

Upgrade a CAPI cluster to a target Kubernetes version.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |
| version | string | Target Kubernetes version. |

**Response:** `200` when the upgrade task is submitted.

> **Note:** although this is an HTTP `GET`, it triggers a state change (a CAPI cluster
> upgrade). It was **not** exercised against the live platform.

---

## Gateway configurations

### GET /clustersv2/{owner}/{cluster}/gateway-configs

List gateway configurations.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Response:** `200` — an array of `GatewayConfigInfo`:

```json
[
  {
    "presetName": "ace",
    "presetNamespace": "ace",
    "configName": "ace",
    "configNamespace": "ace",
    "version": "v2026.6.19",
    "host": "<akp-host>",
    "hostType": "ip",
    "isDefault": true,
    "updateAvailable": false
  }
]
```

| Field | Type | Description |
|---|---|---|
| presetName / presetNamespace | string | Gateway preset name and namespace. |
| configName / configNamespace | string | GatewayConfig object name and namespace. |
| version | string | Chart version of the config. |
| host | string | Gateway host (IP or hostname). |
| hostType | string | Host type (e.g. `ip`, `domain`). |
| isDefault | boolean | Whether this is the default gateway. |
| updateAvailable | boolean | Whether an update to the ace chart version is available. |

> **Verified:** `GET` returned `200` against `appscode/ace` on 2026-07-14.

---

### PUT /clustersv2/{owner}/{cluster}/gateway-configs

Update all non-`ace` gateway configurations to the ace chart version.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

**Request body:** none.

**Response:** `200` when the gateway configurations are updated.

---

### PUT /clustersv2/{owner}/{cluster}/gateway-configs/{namespace}/{name}

Update a single gateway configuration to the ace chart version.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |
| namespace | string | Namespace of the GatewayConfig. |
| name | string | Name of the GatewayConfig. |

**Request body:** none.

**Response:** `200` when updated. `400` if the target is the `ace` gateway config (which
cannot be updated this way).

---

## Virtual clusters (vcluster)

### POST /clustersv2/{owner}/vcluster/create

Create a virtual cluster on a host cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Request body:** a `ClusterOptions` object.

```json
{
  "clusterName": "my-vcluster",
  "hostClusterName": "ace",
  "hostClusterUID": "<uid>",
  "hostClusterOwnerID": 3,
  "hubClusterName": "ace",
  "hubClusterUID": "<uid>",
  "hubClusterOwnerID": 3
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| clusterName | string | No | Name for the new virtual cluster. |
| hostClusterName | string | No | Host cluster name. |
| hostClusterUID | string | No | Host cluster UID. |
| hostClusterOwnerID | integer (int64) | No | Host cluster owner ID. |
| hubClusterName | string | No | Hub cluster name. |
| hubClusterUID | string | No | Hub cluster UID. |
| hubClusterOwnerID | integer (int64) | No | Hub cluster owner ID. |

**Response:** `200` when the creation task is submitted. `422` for an invalid body.

---

### POST /clustersv2/{owner}/vcluster/import

Import a virtual cluster from a host cluster.

**Auth:** token.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |

**Request body:** a `ClusterOptions` object (same schema as
[`/vcluster/create`](#post-clustersv2ownervclustercreate)).

**Response:** `200` when the import task is submitted. `422` for an invalid body.
