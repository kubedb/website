---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-client-organizations-management
    name: Client Org Management
    parent: api-client-organizations
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Client Org Management

Site-admin lifecycle of client organizations: list them, fetch one, create a new
client org (which also provisions its admin user and imports clusters), add or
remove clusters, query status, and delete a client org.

All paths on this page are relative to the API root **`/api/v1`** and require a
personal access token:

```
Authorization: token <YOUR_TOKEN>
```

Every endpoint here is **site-admin only** — the caller must be a platform site
admin acting within an organization. Non-admin callers receive `403`.

Illustrative curl calls use a placeholder host `<akp-host>` and `$AKP_TOKEN`.

> **Platform note:** On the verification platform there are currently **no client
> organizations** — `GET /user/clients` returns an empty list (`[]`, HTTP `200`).
> An empty/`null` list is a valid, verified success response.

---

## List & inspect

### GET /user/clients

List all client organizations known to the platform.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanViewClientOrg`).
  The caller must be acting within an organization (`reqMustFromOrg`).

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | recommended | Organization slug providing the caller's org context. |

**Response:** `200 OK` — a JSON array of `Organization` objects. Empty when no
client orgs exist.

```json
[
  {
    "id": 42,
    "username": "acme-client",
    "full_name": "Acme Client Org",
    "description": "Managed client organization",
    "website": "https://example.com",
    "location": "",
    "rancherManagementClusterEndPoint": "",
    "visibility": "private",
    "orgType": 2
  }
]
```

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/user/clients?org=appscode"
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14; the platform
> has no client orgs, so the body was `[]` (a valid empty result).

---

### GET /user/client/{id}

Fetch a single client organization by its numeric ID.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanViewClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Numeric ID of the client organization. |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | recommended | Caller's organization context. |

**Response:** `200 OK` — a single `Organization` object (same shape as the list
items above). `404` if no client org has that ID.

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/user/client/42?org=appscode"
```

> **Verified:** returned `500` against `appscode` — no client org exists with the
> probed ID on this platform (`user does not exist`). Expected to return `200`
> with an `Organization` once a client org exists.

---

### GET /user/client/{orgname}/status

Aggregate deletion/active status across all clusters of the client organization.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanViewClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `orgname` | string | Client organization slug. |

**Response:** `200 OK` — a `ClientOrgStatus` envelope. `status` is one of
`Active`, `Deleting`, `Partially Deleted`, `Deleted`, or `NotFound`.

```json
{
  "status": "Active"
}
```

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/user/client/acme-client/status?org=appscode"
```

> **Verified:** returned `500` against `appscode` — `appscode` is not itself a
> client org (`org does not exist`). Expected `200` with a `ClientOrgStatus` for a
> real client-org slug.

---

### GET /user/client/{orgname}/cluster/{cluster}/status

Deletion/active status of a single cluster within the client organization.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanViewClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `orgname` | string | Client organization slug. |
| `cluster` | string | Cluster name within the client organization. |

**Response:** `200 OK` — a `ClientOrgStatus` envelope (see above).

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/user/client/acme-client/cluster/acme-prod/status?org=appscode"
```

> **Verified:** returned `500` against `appscode/ace` — `appscode` is not a client
> org on this platform. Expected `200` with a `ClientOrgStatus` for a real
> client-org cluster.

---

## Mutations

The endpoints below change state. They are documented from the OpenAPI schema and
were **not** called against the live platform.

### POST /user/client/create

Create a client organization. This also provisions the org admin user, grants that
user permission on the hub cluster, and imports the requested spoke cluster(s) with
the client org as owner.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanCreateClientOrg`).

**Request body:** `ClientOrgParams`.

```json
{
  "clientOrg": {
    "orgName": "acme-client",
    "orgFullName": "Acme Client Org",
    "description": "Managed client organization",
    "website": "https://example.com",
    "orgType": "client",
    "visibility": "private"
  },
  "hubClusterUID": "<hub-uid>",
  "hubClusterOwnerName": "appscode",
  "userPermission": {
    "userName": "acme-admin",
    "email": "user@example.com",
    "permissions": [
      {
        "name": "acme-prod",
        "isClusterSet": false,
        "roleType": "ClusterRole",
        "roleRefName": "ace:admin"
      }
    ],
    "importCluster": true,
    "clientOrg": true
  },
  "useGateway": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clientOrg` | `CreateOrgParams` | yes | The organization to create (name, full name, type, visibility, optional Rancher sync token, etc.). |
| `hubClusterUID` | string | yes | UID of the hub cluster imported by the site admin. |
| `hubClusterOwnerName` | string | yes | Owner (org slug) of the hub cluster. |
| `userPermission` | `UserOptions` | yes | The org-admin user to provision and the permissions to grant (see [Cluster User Permissions](../cluster-user-permissions.md#useroptions)). |
| `annotations` | map[string]string | no | Annotations applied to created resources. |
| `kubeDBConfig` | `KubeDBConfig` | no | KubeDB scheduling config (node selector, tolerations). |
| `useGateway` | boolean | no | Provision a gateway for the client org. |
| `usableAsShared` | boolean | no | Whether the org's gateway config may be shared by other orgs. |
| `gatewayConfig` / `gatewayConfigRef` | object | no | Inline gateway config or a reference to an existing one (Kubernetes object). |
| `telemetryParams` | `TelemetryParams` | no | Monitoring cluster and retention periods. |

**Responses:** `200` created · `400` invalid params (e.g. missing Rancher
management cluster endpoint) · `409` an org with the same name already exists ·
`422` validation error.

---

### POST /user/client/{orgname}/add-cluster

Import an additional spoke cluster into a client organization, granting the org
admins access and setting up namespaces, gateway presets, and telemetry.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanAddClusterToClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `orgname` | string | Client organization slug. |

**Request body:** `AddClusterParams`.

```json
{
  "hubClusterOwnerName": "appscode",
  "hubClusterName": "ace",
  "hubClusterUID": "<hub-uid>",
  "spokeClusterName": "acme-staging",
  "useGateway": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hubClusterOwnerName` | string | yes | Owner (org slug) of the hub cluster. |
| `hubClusterName` | string | yes | Hub cluster name. |
| `hubClusterUID` | string | yes | Hub cluster UID. |
| `spokeClusterName` | string | yes | Spoke cluster to import into the client org. |
| `annotations` | map[string]string | no | Annotations applied to created resources. |
| `kubeDBConfig` | `KubeDBConfig` | no | KubeDB scheduling config. |
| `useGateway` | boolean | no | Provision a gateway for the added cluster. |
| `gatewayConfig` / `gatewayPresetRef` | object | no | Inline gateway config or a preset reference. |
| `telemetryParams` | `TelemetryParams` | no | Monitoring cluster and retention periods. |

**Responses:** `200` added · `400` the cluster is already imported for this org ·
`422` validation error.

---

### POST /user/client/{orgname}/delete-cluster

Remove a spoke cluster from a client organization, cleaning up the client-org
namespace and associated hub/spoke resources.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanRemoveClusterFromClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `orgname` | string | Client organization slug. |

**Request body:** `RemoveClusterParams`.

```json
{
  "hubClusterOwnerName": "appscode",
  "hubClusterName": "ace",
  "hubClusterUID": "<hub-uid>",
  "spokeClusterName": "acme-staging"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hubClusterOwnerName` | string | yes | Owner (org slug) of the hub cluster. |
| `hubClusterName` | string | yes | Hub cluster name. |
| `hubClusterUID` | string | yes | Hub cluster UID. |
| `spokeClusterName` | string | yes | Spoke cluster to remove. |

**Responses:** `200` removal accepted (cleanup runs asynchronously) · `422`
validation error.

---

### DELETE /user/client/delete/{id}

Delete a client organization, tearing down its namespaces and cluster resources
across all spoke clusters. Rejected if another organization still references this
client org's gateway config.

- **Auth:** token; **site-admin only** (`Organization_SiteAdminCanDeleteClientOrg`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Numeric ID of the client organization. |

**Responses:** `200` deletion accepted (teardown runs asynchronously) · `400` the
client org is still in use by another organization · `404` not found.
