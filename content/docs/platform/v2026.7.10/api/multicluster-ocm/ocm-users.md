---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-multicluster-ocm-ocm-users
    name: OCM Users
    parent: api-multicluster-ocm
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# OCM Users

Manage OCM users on a hub cluster and their per-cluster / per-cluster-set
permissions, and fetch a user's kubeconfig for a spoke cluster. All paths on this
page are relative to the `/api/v1` prefix and are hub-scoped:
`/api/v1/clusters/{owner}/{cluster}/...` where `owner` is an organization or user
slug and `{cluster}` is the OCM hub cluster (for example `ace`). Every endpoint
requires a personal access token (`Authorization: token <YOUR_TOKEN>`) and authorizes
the caller against the owner and cluster.

Common path parameters:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization or user slug that owns the cluster. |
| `cluster` | string | Hub cluster name. |
| `id` | integer (int64) | OCM user ID (on the `/user/{id}...` routes). |

Example call:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clusters/appscode/ace/users
```

The `Permission` object is used throughout this page (in `UserOptions` and
`UserPermissions`):

| Field | Type | Description |
|---|---|---|
| `name` | string | Cluster or cluster set name. |
| `isClusterSet` | boolean | Whether `name` refers to a cluster set. |
| `roleType` | string | Role scope: `ClusterRole` or `Role`. |
| `roleRefName` | string | Referenced role name. |
| `roleRefNamespace` | string[] | Namespaces the role applies to. |
| `managedClusterRoleBindingName` | string | Backing managed-cluster role binding name. |
| `managedClusterSetRoleBindingName` | string | Backing managed-cluster-set role binding name. |

## Listing users

### GET /clusters/{owner}/{cluster}/users

List the OCM users on the hub cluster.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Response:** `200` — array of `User` objects.

```json
[
  {
    "id": 2,
    "login": "user1",
    "username": "user1",
    "full_name": "Example User",
    "email": "user@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/<hash>?d=identicon",
    "is_admin": false,
    "active": true,
    "orgAdmin": false,
    "clientOrgUser": false,
    "created": "2026-07-05T06:46:29Z"
  }
]
```

The `User` object represents an individual or organization. Common fields: `id`,
`login`/`username` (username; `username` is a backward-compatibility alias),
`full_name`, `email`, `avatar_url`, `is_admin`, `active`, `type`, `orgAdmin`,
`orgType`, `clientOrgUser`, `created`, `last_login`.

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

## Creating & inspecting a user

### POST /clusters/{owner}/{cluster}/user/create

Create an OCM user with cluster / cluster-set permissions.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`.
- **Request body:** `UserOptions`.

```json
{
  "id": 0,
  "userName": "user1",
  "email": "user@example.com",
  "importCluster": false,
  "clientOrg": false,
  "permissions": [
    {
      "name": "cp-dbaas-generic",
      "isClusterSet": true,
      "roleType": "ClusterRole",
      "roleRefName": "cluster-admin"
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | integer (int64) | No | Platform user ID (when linking an existing account). |
| `userName` | string | Yes | Username for the OCM user. |
| `email` | string | No | User's email address. |
| `permissions` | Permission[] | No | Cluster / cluster-set permissions to grant (see `Permission` table above). |
| `importCluster` | boolean | No | Whether the user may import clusters. |
| `clientOrg` | boolean | No | Whether the user belongs to a client organization. |

- **Response:** `200` — OCM user created. `422` on validation error.

### GET /clusters/{owner}/{cluster}/user/{id}

Get an OCM user's cluster and cluster-set permissions.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`.
- **Response:** `200` — a `UserPermissions` object. The two maps marshal with
  capitalized Go field names (`ClusterPermissions` / `ClusterSetPermissions`); each
  maps a cluster / cluster-set name to a list of `Permission` objects. `404` if the
  user does not exist.

```json
{
  "ClusterPermissions": {
    "arnob-dev": [
      { "name": "arnob-dev", "isClusterSet": false, "roleType": "ClusterRole", "roleRefName": "cluster-admin" }
    ]
  },
  "ClusterSetPermissions": {
    "cp-dbaas-generic": [
      { "name": "cp-dbaas-generic", "isClusterSet": true, "roleType": "ClusterRole", "roleRefName": "cluster-admin" }
    ]
  }
}
```

### GET /clusters/{owner}/{cluster}/user/{id}/access

List the clusters / namespaces accessible to an OCM user.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`.
- **Response:** `200` — a sorted array of accessible cluster / namespace names
  (strings). `404` if the user does not exist.

```json
["arnob-dev", "arnob-dev/default", "arnob-monitoring"]
```

### GET /clusters/{owner}/{cluster}/user/{id}/{spokeName}/kubeconfig

Get an OCM user's kubeconfig for a specific spoke cluster.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`, plus `spokeName` (the spoke cluster
  name).
- **Response:** `200` — the kubeconfig (YAML) returned as a JSON-encoded string.
  `404` if the user does not exist. Treat the returned kubeconfig as a secret.

```json
"apiVersion: v1\nkind: Config\nclusters:\n- cluster:\n    server: https://<spoke-host>:6443\n..."
```

## Updating & removing users

### POST /clusters/{owner}/{cluster}/user/{id}/update

Update an OCM user's permissions (replaces the user's permission set).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`.
- **Request body:** `UserOptions` (see `user/create` above).
- **Response:** `200` — user permissions updated. `422` on validation error.

### POST /clusters/{owner}/{cluster}/user/{id}/remove

Remove specific permissions from an OCM user (without deleting the user).

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`.
- **Request body:** `RemovePermissionOpts`.

```json
{
  "namespaceScopedResources": [
    { "Namespace": "default", "Name": "arnob-dev" }
  ],
  "clusterScopedResources": ["cp-dbaas-generic"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `namespaceScopedResources` | NamespacedName[] | No | Namespace-scoped grants to remove. Each is `{ "Namespace": ..., "Name": ... }` (capitalized keys — the source struct has no JSON tags). |
| `clusterScopedResources` | string[] | No | Cluster-scoped (cluster / cluster-set) names to remove. |

- **Response:** `200` — permissions removed from the user. `422` on validation error.

### DELETE /clusters/{owner}/{cluster}/user/{id}/delete

Delete an OCM user entirely.

- **Auth:** token. Authorizes against `owner`/`cluster`.
- **Path parameters:** `owner`, `cluster`, `id`.
- **Request body:** none.
- **Response:** `200` — OCM user deleted. `404` if the user does not exist.
