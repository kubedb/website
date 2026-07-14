---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cloud-providers-cloud-providers
    name: Cloud Providers
    parent: api-cloud-providers
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cloud Providers

Discovery and provisioning APIs for cloud Kubernetes providers. All paths on this
page are relative to the API base **`/api/v1`** — for example the discovery route
written `GET /clouds/{owner}/providers/gke/projects` is served at
`/api/v1/clouds/{owner}/providers/gke/projects`.

Except for the public provider list, every endpoint requires a personal access
token:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clouds/appscode/providers/eks/regions
```

The per-provider discovery routes talk to the cloud provider's API using a
**stored cloud credential** for the referenced provider under the `{owner}`
scope. If no matching credential is stored for the owner (or the provider needs
extra configuration, such as a configured Rancher client), the route returns an
error. Cloud credentials are managed via the
[user/organization credentials APIs](../../users-settings/authenticated-user.md).

## Common path parameter

Every owner-scoped route below takes an `{owner}` path parameter:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization slug or username that owns the stored cloud credentials. |

Other path parameters (`project`, `region`, `resourcegroup`, `cluster`, `id`) are
described per endpoint.

## Common response shapes

Several discovery endpoints share these response schemas.

`Locations` — a cloud region with its availability zones:

```json
{
  "region": "us-east1",
  "description": "South Carolina",
  "zones": ["us-east1-b", "us-east1-c", "us-east1-d"]
}
```

`VMInfo` — a machine type / server type:

```json
{
  "name": "e2-standard-4",
  "description": "4 vCPU, 16 GB",
  "cpu": 4,
  "core": 2,
  "memoryMb": 16384,
  "disksSizeGb": 0,
  "iops": 0,
  "shared": false,
  "baremetal": false,
  "gpus": 0,
  "category": "general-purpose",
  "family": "e2",
  "instanceHypervisor": "kvm",
  "architecture": ["amd64"],
  "capacityType": ["on-demand", "spot"],
  "networkBW": "up to 10 Gbps",
  "ebsBW": "",
  "monthlyCost": "97.09"
}
```

`ClusterInfo` — summary of a managed cluster on the provider (used when listing or
inspecting clusters for import):

```json
{
  "id": 0,
  "displayName": "prod",
  "name": "prod",
  "uid": "<uid>",
  "provider": "gce",
  "vendor": "gke",
  "endpoint": "https://34.x.x.x",
  "location": "us-east1",
  "project": "my-gcp-project",
  "kubernetesVersion": "1.30.1",
  "nodeCount": 3,
  "createdAt": "2026-01-01T00:00:00Z",
  "age": "6mo",
  "clusterManagers": ["gke"],
  "isCapiClusterUpgradeable": false,
  "status": {}
}
```

`ClusterInfo` fields include `id`/`uid`/`externalID` identifiers, `displayName`
and `name`, provider metadata (`provider`, `vendor`, `endpoint`, `location`,
`project`), `kubernetesVersion`, `nodeCount`, `createdAt`/`age`, and a
Kubernetes-style `status` object. Not all fields are populated for every provider.

---

## Provider catalog

### GET /clouds

Lists the cloud providers the platform supports for cluster provisioning and
discovery.

- **Auth:** public — no authentication required.
- **Path parameters:** none.
- **Query parameters:** none.

**Response** `200` — a `CloudProviderList` (a Kubernetes-style list whose `items`
carry the provider name in `metadata.name`):

```json
{
  "metadata": {},
  "items": [
    { "metadata": { "name": "gce" }, "spec": {} },
    { "metadata": { "name": "digitalocean" }, "spec": {} },
    { "metadata": { "name": "packet" }, "spec": {} },
    { "metadata": { "name": "aws" }, "spec": {} },
    { "metadata": { "name": "azure" }, "spec": {} },
    { "metadata": { "name": "vultr" }, "spec": {} },
    { "metadata": { "name": "linode" }, "spec": {} },
    { "metadata": { "name": "scaleway" }, "spec": {} }
  ]
}
```

Each item's `spec` may optionally carry `regions` (region + zones + location) and
`machineTypes`, but is typically empty in the list response — use the per-provider
discovery endpoints below to enumerate regions and machine types.

> **Verified:** `GET` returned `200` against the live platform on 2026-07-14; the
> response shown above is the sanitized live payload.

---

## Provisioning

### POST /clouds/{owner}/{provider}/cluster

Provisions a new Cluster API (CAPI) based cluster on the given cloud provider and
imports it into the platform. For `kubevirt` the CAPI cluster config is validated
(worker pools, machine count, cpu, memory are required).

- **Auth:** token. Requires stored cloud credentials for the referenced provider
  under the owner scope.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization slug or username that owns the cloud credentials. |
| `provider` | string | Target cloud provider name (e.g. `gke`, `aks`, `eks`, `kubevirt`). |

- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `response-id` | string | no | Correlation id for the asynchronous provisioning response. |

**Request body** — a `ClusterProvisionConfig`:

```json
{
  "capiClusterConfig": {
    "clusterName": "demo",
    "region": "us-east1",
    "networkCIDR": "10.0.0.0/16",
    "kubernetesVersion": "1.30.1",
    "googleProjectID": "my-gcp-project",
    "controlPlane": {
      "machineType": "e2-standard-4",
      "machineCount": 1,
      "cpu": 4,
      "memory": 16384
    },
    "workerPools": [
      {
        "machineType": "e2-standard-4",
        "machineCount": 3,
        "cpu": 4,
        "memory": 16384
      }
    ]
  },
  "importOptions": {
    "basicInfo": { "name": "demo", "displayName": "Demo" },
    "provider": { "name": "gce", "credential": "my-gcp-cred" },
    "components": { "fluxCD": true, "allFeatures": false }
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `capiClusterConfig` | object | yes | CAPI cluster configuration (see below). |
| `capiClusterConfig.clusterName` | string | — | Name for the new cluster. |
| `capiClusterConfig.region` | string | — | Provider region. |
| `capiClusterConfig.networkCIDR` | string | — | Pod/network CIDR. |
| `capiClusterConfig.kubernetesVersion` | string | — | Kubernetes version. |
| `capiClusterConfig.googleProjectID` | string | — | GCP project id (GKE only). |
| `capiClusterConfig.controlPlane` | object | — | Control-plane machine pool (`machineType`, `machineCount`, `cpu`, `memory` — all required within a pool). |
| `capiClusterConfig.workerPools` | array | — | Worker machine pools; each pool requires `machineType`, `machineCount`, `cpu`, `memory`. |
| `importOptions` | object | — | How to import the resulting cluster: `basicInfo`, `provider` (credential/region/project), and `components` (feature sets, FluxCD). |

**Response** `200` — a `ProviderOptions` describing the provisioned cluster:

```json
{
  "name": "demo",
  "credential": "my-gcp-cred",
  "clusterID": "<uid>",
  "project": "my-gcp-project",
  "region": "us-east1",
  "kubeConfig": "<redacted>"
}
```

`ProviderOptions` fields: `name`, `credential`, `eksAuthMode` (`IRSA` or
`PodIdentity`, EKS only), `clusterID`, `project`, `region`, `resourceGroup`, and
`kubeConfig`. Error responses: `400` (invalid CAPI config, e.g. missing worker
pools), `401` (unauthenticated), `403` (forbidden), `422` (body failed
validation).

> **Not verified:** write endpoint — not called against the live platform per
> GET-only policy.

---

## GKE discovery

Google Kubernetes Engine discovery routes. All are `GET`, token-authenticated, and
require stored GKE credentials for `{owner}`.

### GET /clouds/{owner}/providers/gke/projects

Lists the Google Cloud projects accessible with the stored GKE credentials.

- **Auth:** token + stored GKE credentials.
- **Response** `200` — an array of project id strings: `["my-gcp-project", "..."]`.

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — no GKE cloud credential is stored for the `appscode` owner, so the
> handler cannot reach the GCP API.

### GET /clouds/{owner}/providers/gke/projects/{project}/regions/

Lists available regions (with zones) for the given GKE project.

- **Path parameters:** `project` (string) — GKE project id.
- **Response** `200` — an array of [`Locations`](#common-response-shapes).

> **Verified:** requires stored GKE credentials; not reachable for `appscode`
> (same missing-credential condition as `.../gke/projects`).

### GET /clouds/{owner}/providers/gke/projects/{project}/regions/{region}/kubernetesversions

Lists the supported Kubernetes versions for the given GKE project and region.

- **Path parameters:** `project` (string), `region` (string).
- **Response** `200` — an array of version strings, e.g. `["1.29.5", "1.30.1"]`.

> **Verified:** requires stored GKE credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/gke/projects/{project}/regions/{region}/vms

Lists available machine types for the given GKE project, region and zone, grouped
by family.

- **Path parameters:** `project` (string), `region` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `zone` | string | yes | GKE zone (e.g. `us-east1-b`). |

- **Response** `200` — an object mapping family name → array of
  [`VMInfo`](#common-response-shapes):

```json
{
  "e2": [ { "name": "e2-standard-4", "cpu": 4, "memoryMb": 16384 } ],
  "n2": [ { "name": "n2-standard-8", "cpu": 8, "memoryMb": 32768 } ]
}
```

> **Verified:** requires stored GKE credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/gke/projects/{project}/clusters

Lists the GKE clusters that exist in the given project.

- **Path parameters:** `project` (string).
- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** requires stored GKE credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/gke/projects/{project}/clusters/{cluster}

Returns detailed information for a single GKE cluster (for import).

- **Path parameters:** `project` (string), `cluster` (string) — GKE cluster name.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `location` | string | no | GKE cluster location. |

- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`
  (not found), `409` (already imported).

> **Verified:** requires stored GKE credentials; not reachable for `appscode`.

---

## AKS discovery

Azure Kubernetes Service discovery routes. All are `GET`, token-authenticated, and
require stored AKS credentials for `{owner}`.

### GET /clouds/{owner}/providers/aks/regions/

Lists the supported Azure (AKS) regions.

- **Response** `200` — an array of [`Locations`](#common-response-shapes).

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — no AKS cloud credential is stored for the `appscode` owner.

### GET /clouds/{owner}/providers/aks/regions/{region}/vms

Lists available machine types for the given AKS region, grouped by family.

- **Path parameters:** `region` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `zones` | string | yes | Comma-separated availability zones (e.g. `1,2,3`). |

- **Response** `200` — an object mapping family name → array of
  [`VMInfo`](#common-response-shapes).

> **Verified:** requires stored AKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/aks/regions/{region}/kubernetesversions

Lists the supported Kubernetes versions for the given AKS region.

- **Path parameters:** `region` (string).
- **Response** `200` — an array of version strings.

> **Verified:** requires stored AKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/aks/resourcegroups

Lists the Azure resource groups accessible with the stored AKS credentials.

- **Response** `200` — an array of resource group name strings.

> **Verified:** requires stored AKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/aks/resourcegroups/{resourcegroup}/clusters

Lists the AKS managed clusters in the given Azure resource group.

- **Path parameters:** `resourcegroup` (string).
- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** requires stored AKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/aks/resourcegroups/{resourcegroup}/clusters/{cluster}

Returns detailed information for a single AKS cluster (for import).

- **Path parameters:** `resourcegroup` (string), `cluster` (string).
- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`,
  `409` (import conflict).

> **Verified:** requires stored AKS credentials; not reachable for `appscode`.

---

## EKS discovery

Amazon Elastic Kubernetes Service discovery routes. All are `GET`,
token-authenticated, and require stored EKS credentials for `{owner}` (region
listing may fall back to a default credential).

### GET /clouds/{owner}/providers/eks/regions

Lists the supported AWS (EKS) regions. If no credential is stored, a default
credential may be used.

- **Response** `200` — an array of [`Locations`](#common-response-shapes).

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — resolving AWS regions failed with no usable AWS credential for the
> `appscode` owner.

### GET /clouds/{owner}/providers/eks/regions/{region}/kubernetesversions

Lists the supported Kubernetes versions for EKS.

- **Path parameters:** `region` (string).
- **Response** `200` — an array of version strings.

> **Verified:** requires stored EKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/eks/regions/{region}/vms

Lists available machine types for the given EKS region, grouped by family.

- **Path parameters:** `region` (string).
- **Response** `200` — an object mapping family name → array of
  [`VMInfo`](#common-response-shapes).

> **Verified:** requires stored EKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/eks/regions/{region}/clusters

Lists the EKS clusters in the given AWS region.

- **Path parameters:** `region` (string).
- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** requires stored EKS credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/eks/regions/{region}/clusters/{cluster}

Returns detailed information for a single EKS cluster (for import).

- **Path parameters:** `region` (string), `cluster` (string).
- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`,
  `409` (import conflict).

> **Verified:** requires stored EKS credentials; not reachable for `appscode`.

---

## DigitalOcean discovery

DigitalOcean Kubernetes (DOKS) discovery routes. All are `GET`,
token-authenticated, and require stored DigitalOcean credentials for `{owner}`.

### GET /clouds/{owner}/providers/digitalocean/clusters

Lists the DigitalOcean managed Kubernetes (DOKS) clusters.

- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — no DigitalOcean cloud credential is stored for the `appscode`
> owner.

### GET /clouds/{owner}/providers/digitalocean/clusters/{id}

Returns detailed information for a single DigitalOcean cluster (for import).

- **Path parameters:** `id` (string) — DigitalOcean cluster id.
- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`,
  `409` (import conflict).

> **Verified:** requires stored DigitalOcean credentials; not reachable for
> `appscode`.

---

## Linode discovery

Linode Kubernetes Engine (LKE) discovery routes. All are `GET`,
token-authenticated, and require stored Linode credentials for `{owner}`.

### GET /clouds/{owner}/providers/linode/clusters

Lists the Linode Kubernetes Engine (LKE) clusters.

- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — no Linode cloud credential is stored for the `appscode` owner.

### GET /clouds/{owner}/providers/linode/clusters/{id}

Returns detailed information for a single Linode cluster (for import).

- **Path parameters:** `id` (integer, int64) — numeric LKE cluster id.
- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`,
  `409` (import conflict).

> **Verified:** requires stored Linode credentials; not reachable for `appscode`.

---

## Rancher discovery

Rancher-managed cluster discovery routes. All are `GET`, token-authenticated, and
require both stored cloud credentials and a configured Rancher client for
`{owner}`.

### GET /clouds/{owner}/providers/rancher/clusters/

Lists the clusters managed by the configured Rancher server.

- **Response** `200` — an array of [`ClusterInfo`](#common-response-shapes).

> **Verified:** requires stored credentials and a configured Rancher client; not
> reachable for `appscode`.

### GET /clouds/{owner}/providers/rancher/clusters/{id}

Returns detailed information for a single Rancher-managed cluster (for import).

- **Path parameters:** `id` (string) — Rancher cluster id.
- **Response** `200` — a [`ClusterInfo`](#common-response-shapes). Errors: `404`,
  `409` (import conflict).

> **Verified:** requires stored credentials and a configured Rancher client; not
> reachable for `appscode`.

---

## Hetzner discovery

Hetzner Cloud discovery routes. All are `GET`, token-authenticated, and require
stored Hetzner credentials for `{owner}`.

### GET /clouds/{owner}/providers/hetzner/servers

Lists all Hetzner Cloud server types (machine types).

- **Response** `200` — an array of [`VMInfo`](#common-response-shapes).

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — no Hetzner cloud credential is stored for the `appscode` owner.

### GET /clouds/{owner}/providers/hetzner/kubernetesversions

Lists the supported Kubernetes versions for Hetzner.

- **Response** `200` — an array of version strings.

> **Verified:** returned `302` (redirect to `/500`) against `appscode` on
> 2026-07-14 — the handler resolves the Hetzner credential before returning
> versions, and none is stored for `appscode`.

### GET /clouds/{owner}/providers/hetzner/regions/

Lists the available Hetzner Cloud regions (locations).

- **Response** `200` — an array of [`Locations`](#common-response-shapes).

> **Verified:** requires stored Hetzner credentials; not reachable for `appscode`.

### GET /clouds/{owner}/providers/hetzner/regions/{region}/servers

Lists the Hetzner Cloud server types available in the given region.

- **Path parameters:** `region` (string) — Hetzner region (location).
- **Response** `200` — an array of [`VMInfo`](#common-response-shapes).

> **Verified:** requires stored Hetzner credentials; not reachable for `appscode`.

---

## KubeVirt discovery

### GET /clouds/{owner}/providers/kubevirt/kubernetesversions

Lists the supported Kubernetes versions for KubeVirt-based clusters.

- **Auth:** token.
- **Response** `200` — an array of version strings:

```json
["1.27.14", "1.28.10", "1.29.5", "1.30.1"]
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (this list
> is served from static configuration and does not need a cloud credential); the
> response shown above is the sanitized live payload.
