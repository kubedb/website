---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-client-organizations-cluster-user-permissions
    name: Cluster User Permissions
    parent: api-client-organizations
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster User Permissions

Manage the OCM users belonging to a client organization on a specific cluster:
list them, create a user with permissions, inspect and update those permissions,
generate a kubeconfig, remove specific grants, and delete the user entirely.

All paths on this page are relative to the API root **`/api/v1`** and require a
personal access token:

```
Authorization: token <YOUR_TOKEN>
```

**Path parameters common to every endpoint here:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization slug that owns the cluster. **Must resolve to a client organization** (`reqClientOrg`); otherwise the request is rejected. |
| `cluster` | string | Cluster name within the `owner` scope. |

**Auth:** `GET /permission/users` requires a valid token and that `owner` is a
client org. Every other endpoint additionally requires **organization-admin**
authorization on `owner` (`Organization_Admin`).

Illustrative curl calls use a placeholder host `<ace-host>` and `$ACE_TOKEN`.

---

### GET /clusters/{owner}/{cluster}/permission/users

List the users of the client organization (`owner`) that have been granted access
on this cluster.

- **Auth:** token; `owner` must resolve to a client organization.

**Response:** `200 OK` — a JSON array of `User` objects.

```json
[
  {
    "id": 101,
    "login": "acme-admin",
    "username": "acme-admin",
    "full_name": "Acme Admin",
    "email": "user@example.com",
    "active": true,
    "orgAdmin": true,
    "clientOrgUser": true
  }
]
```

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clusters/acme-client/acme-prod/permission/users
```

> **Verified:** returned `500` against `appscode/ace` — `appscode` is not a client
> organization on this platform (`user isn't a client organization`), so the
> `reqClientOrg` check fails. Expected `200` with a `User` array when `owner` is a
> real client org.

---

### POST /clusters/{owner}/{cluster}/permission/user/create

Create an OCM user for the client organization on this cluster and assign the
requested permissions (creating the necessary RBAC role / cluster-role bindings and
importing/connecting clusters for the user).

- **Auth:** token; **organization-admin** on `owner`.

**Request body:** `UserOptions` (see [below](#useroptions)).

```json
{
  "userName": "acme-dev",
  "email": "user@example.com",
  "permissions": [
    {
      "name": "acme-prod",
      "isClusterSet": false,
      "roleType": "ClusterRole",
      "roleRefName": "ace:admin",
      "roleRefNamespace": ["team-a"]
    }
  ],
  "importCluster": true,
  "clientOrg": true
}
```

**Responses:** `200` user created and permissions assigned · `400` invalid
permission options for the client org · `422` validation error.

---

### POST /clusters/{owner}/{cluster}/permission/user/{id}

Get the roles and cluster-roles assigned to a client-org user on this cluster,
scoped to the namespaces supplied in the request body. (This is a `POST` because it
takes a namespace-scope selector in the body, but it is a read operation.)

- **Auth:** token; **organization-admin** on `owner`.

**Path parameters:** `owner`, `cluster` (above), plus:

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Numeric ID of the user. |

**Request body:** `PermissionScopes`.

```json
{
  "namespaceList": ["team-a", "team-b"],
  "allNamespaces": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `namespaceList` | string[] | no | Namespaces to scope the query to. |
| `allNamespaces` | boolean | no | When true, return permissions across all namespaces. |

**Response:** `200 OK` — a `ClientOrgUserPermission` object. `400` if the user is
not part of the client org.

```json
{
  "ClusterRoles": [
    {
      "ResourceName": "acme-dev-binding",
      "ResourceNamespace": "",
      "RoleName": "ace:admin",
      "RoleNamespace": ""
    }
  ],
  "Roles": [
    {
      "ResourceName": "acme-dev-team-a-binding",
      "ResourceNamespace": "team-a",
      "RoleName": "ace:editor",
      "RoleNamespace": "team-a"
    }
  ]
}
```

> Field names are capitalized because the source Go structs (`ocm.ClientOrgUserPermission`,
> `ocm.ClientOrgUserPermissionDetails`) carry no JSON tags.

---

### GET /clusters/{owner}/{cluster}/permission/user/{id}/kubeconfig

Generate a kubeconfig for a client-org user to access this cluster, provided the
user has permission in the client organization's cluster.

- **Auth:** token; **organization-admin** on `owner`.

**Path parameters:** `owner`, `cluster`, plus:

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Numeric ID of the user. |

**Response:** `200 OK` — the generated kubeconfig, returned as a JSON string
containing a YAML document. `400` if the user does not have permission in the
client-org cluster.

```json
"apiVersion: v1\nkind: Config\nclusters:\n- cluster:\n    server: https://<cluster-endpoint>\n  name: acme-prod\n..."
```

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clusters/acme-client/acme-prod/permission/user/101/kubeconfig
```

> **Verified:** not called live — requires a real client-org user ID, which does
> not exist on this platform (no client orgs). Documented from schema.

---

### POST /clusters/{owner}/{cluster}/permission/user/{id}/update

Re-assign a client-org user's permissions on this cluster.

- **Auth:** token; **organization-admin** on `owner`.

**Path parameters:** `owner`, `cluster`, plus `id` (integer, int64 — the user ID).

**Request body:** `UserOptions` (see [below](#useroptions)) — same shape as
`user/create`.

**Responses:** `200` permissions updated · `400` invalid permission options ·
`404` user not found · `422` validation error.

---

### POST /clusters/{owner}/{cluster}/permission/user/{id}/remove

Delete the named cluster-scoped and namespace-scoped RBAC bindings for a client-org
user on this cluster (removes specific grants without deleting the user).

- **Auth:** token; **organization-admin** on `owner`.

**Path parameters:** `owner`, `cluster`, plus `id` (integer, int64 — the user ID).

**Request body:** `RemovePermissionOpts`.

```json
{
  "clusterScopedResources": ["acme-dev-binding"],
  "namespaceScopedResources": [
    { "Namespace": "team-a", "Name": "acme-dev-team-a-binding" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clusterScopedResources` | string[] | no | Names of cluster-scoped RBAC bindings to delete. |
| `namespaceScopedResources` | `NamespacedName[]` | no | Namespaced bindings to delete. Each item marshals with capitalized keys `Namespace` and `Name` (the source struct has no JSON tags). |

**Responses:** `200` permissions removed · `404` user not found · `422` validation
error.

---

### DELETE /clusters/{owner}/{cluster}/permission/user/{id}/delete

Remove a client-org user entirely from this cluster: strips the hub-owner and
client-org annotations and deletes all associated RBAC role and cluster-role
bindings.

- **Auth:** token; **organization-admin** on `owner`.

**Path parameters:** `owner`, `cluster`, plus `id` (integer, int64 — the user ID).

**Responses:** `200` user removed from the cluster · `404` user not found.

---

## Schemas

### UserOptions

Options for creating or updating an OCM user's permissions. Used by
`user/create`, `user/{id}/update`, and by the `userPermission` field of the
client-org create call.

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | User ID (for updates). |
| `userName` | string | The user's username. |
| `email` | string | The user's email. |
| `permissions` | `Permission[]` | Cluster / cluster-set permission grants (see below). |
| `importCluster` | boolean | Import/connect the referenced clusters for the user. |
| `clientOrg` | boolean | Whether this user belongs to a client organization. |

**Permission** — a single cluster or cluster-set permission grant:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Cluster or cluster-set name. |
| `isClusterSet` | boolean | True if `name` refers to a cluster set. |
| `roleType` | string | Role scope: `ClusterRole` or `Role`. |
| `roleRefName` | string | Name of the referenced (cluster-)role. |
| `roleRefNamespace` | string[] | Namespaces the role applies to (for `Role` scope). |
| `managedClusterRoleBindingName` | string | Name of the generated managed cluster role binding. |
| `managedClusterSetRoleBindingName` | string | Name of the generated managed cluster-set role binding. |
