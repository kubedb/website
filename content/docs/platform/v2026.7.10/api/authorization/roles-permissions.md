---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-authorization-roles-permissions
    name: Roles & Permissions
    parent: api-authorization
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Roles & Permissions

This page documents ACE's custom authorization API: inspecting the permissions
the caller holds on an object, discovering assignable permissions, and managing
custom roles.

All paths on this page are relative to the API root `/api/v1`. The full prefix
for every endpoint here is `/api/v1/authz`.

## Authentication & org context

Every endpoint requires a valid personal access token (or access token). Send it
as a header:

```
Authorization: token <YOUR_TOKEN>
```

In addition, **organization context is mandatory and is supplied via the `?org=`
query parameter** (not the path). For example, `?org=appscode`. Most endpoints
also require that the caller be a member of that organization, and several add a
relationship-based authorization check (`create_role:org`, `view:role`,
`edit:role`, `delete:role`, `viewer:role`) noted per endpoint.

Error responses use a standard envelope:

```json
{
  "message": "human-readable error",
  "url": "https://<ace-host>/api/swagger"
}
```

---

## Object allowed-permissions

These endpoints answer "what may the current requester do to this object?" They
resolve the caller's relationships to the target object and return the list of
permission relations they hold.

### Object types

The `objectType` accepted by these endpoints is one of:

| objectType | Refers to |
|---|---|
| `user` | A user account (the `objectID` must equal the requester's own user ID) |
| `organization` | An organization |
| `team` | A team |
| `cluster` | A cluster |
| `contract` | A billing contract |
| `robot_ac` | A robot account |
| `token` | An access token |

Any other value yields `400 Bad Request` with an `invalid object type` message.

### GET /authz/objects/{objectType}/{objID}/allowed-permissions

Returns the requester's allowed permissions on a single identified object.

- **Auth:** token (`Authorization: token`, `?token=`, or `?access_token=`) + `?org=` context.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `objectType` | string | The kind of object being inspected. See [Object types](#object-types). |
| `objID` | integer (int64) | The numeric ID of the object. For `user`, must equal the requester's own user ID. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `200 OK` — an `AuthObjectAllowedPermissions` object.

```json
{
  "objectType": "team",
  "objectID": 1,
  "allowedPermissions": [
    "can_view",
    "can_edit",
    "can_add_member"
  ]
}
```

Fields: `objectType` and `objectID` echo the request; `allowedPermissions` is the
list of relation strings the requester holds on that object (empty array if none).
`400` is returned for an invalid object type/ID, `401` if unauthenticated, `403`
if forbidden.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/authz/objects/team/1/allowed-permissions?org=appscode"
```

> **Verified:** `GET` returned `200` against `appscode` (org context) on 2026-07-14 for `objectType=team`, `objID=1` (returned `["can_view","can_edit","can_add_member"]`). Note: `objectType=organization` returned `500` in this environment ("Team does not exist"), and an unsupported `objectType` returns `400`.

### POST /authz/objects/allowed-permissions

Batch variant of the above: returns the requester's allowed permissions for each
supplied object identifier, in the same order.

- **Auth:** token + `?org=` context.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Request body:** a JSON array of `AuthObjectIdentifier` objects.

```json
[
  { "objectType": "team", "objectID": 1 },
  { "objectType": "cluster", "objectID": 42 }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `objectType` | string | yes | The kind of object. See [Object types](#object-types). |
| `objectID` | integer (int64) | yes | The numeric ID of the object. |

**Response:** `200 OK` — a JSON array of `AuthObjectAllowedPermissions`, one entry
per requested identifier.

```json
[
  {
    "objectType": "team",
    "objectID": 1,
    "allowedPermissions": ["can_view", "can_edit", "can_add_member"]
  },
  {
    "objectType": "cluster",
    "objectID": 42,
    "allowedPermissions": ["can_view_kubeconfig"]
  }
]
```

`400` for an invalid object type/ID in any element, `401` unauthenticated, `403`
forbidden, `422` for a malformed body.

---

## Available permissions

### GET /authz/roles/available_permissions

Returns the catalog of permissions that can be assigned within the caller's
organization context — the building blocks used when creating or updating a role.

- **Auth:** token + `?org=` context + membership of that organization.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `200 OK`. The body is an `authzstores.VirtualPermissionsData`
structure (represented generically in the OpenAPI schema). In practice it is a
`permissions` array where each entry has a `namespace`, an `action`, a
human-readable `description`, and an optional `associated` list of permissions
that are implied or required alongside it.

```json
{
  "permissions": [
    {
      "namespace": "org_mgmt",
      "action": "edit",
      "description": "Update organization details and configuration"
    },
    {
      "namespace": "cluster_mgmt",
      "action": "view clusters",
      "description": "View clusters associated with the organization and their details",
      "associated": [
        { "namespace": "cluster_mgmt", "action": "import clusters", "required": false }
      ]
    }
  ]
}
```

The `namespace`/`action` pairs are exactly the values you supply in a role's
`permissions` list (see below). `401` unauthenticated, `403` forbidden.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/authz/roles/available_permissions?org=appscode"
```

> **Verified:** `GET` returned `200` against `appscode` (org context) on 2026-07-14; returned a `permissions` catalog spanning namespaces such as `org_mgmt` and `cluster_mgmt`.

---

## Roles

Custom roles bundle a set of permissions and can be attached to one or more teams
within an organization.

### GET /authz/roles

Lists the custom roles defined in the organization.

- **Auth:** token + `?org=` context + membership of that organization.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `200 OK` — an array of `RoleResponse` objects.

```json
[
  {
    "id": 12,
    "name": "Cluster Operators",
    "owner_id": 3,
    "description": "Can view and reconfigure clusters",
    "permissions": [
      { "namespace": "cluster_mgmt", "action": "view clusters" },
      { "namespace": "cluster_mgmt", "action": "reconfigure clusters" }
    ],
    "team_ids": [7],
    "created_at": "2026-07-01T10:00:00Z",
    "updated_at": "2026-07-01T10:00:00Z"
  }
]
```

`401` unauthenticated, `403` forbidden. An organization with no custom roles
returns an empty array `[]`.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/authz/roles?org=appscode"
```

> **Verified:** `GET` returned `200` against `appscode` (org context) on 2026-07-14; the response was `[]` (no custom roles defined in this org).

### POST /authz/roles

Creates a custom role.

- **Auth:** token + `?org=` context + membership + the `create_role:org` authorization relation.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Request body:** a `CreateRoleRequest`.

```json
{
  "name": "Cluster Operators",
  "description": "Can view and reconfigure clusters",
  "permissions": [
    { "namespace": "cluster_mgmt", "action": "view clusters" },
    { "namespace": "cluster_mgmt", "action": "reconfigure clusters" }
  ],
  "teamIDs": [7]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Display name of the role. |
| `permissions` | array of `PermissionInput` | yes | Permissions granted by the role. |
| `description` | string | no | Human-readable description. |
| `teamIDs` | array of integer (int64) | no | Teams the role is assigned to. |

Each `PermissionInput` has a `namespace` (a `PermissionNamespace` value) and an
`action`; use the pairs returned by
[available_permissions](#get-authzrolesavailablepermissions).

**Response:** `201 Created` — the created `RoleResponse` (same shape as the list
entry above, with server-assigned `id`, `owner_id`, and timestamps). `400`
invalid request, `401` unauthenticated, `403` forbidden (missing
`create_role:org`), `422` validation error.

### GET /authz/roles/{id}

Fetches a single role by ID.

- **Auth:** token + `?org=` context + membership + the `view:role` authorization relation.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `id` | integer (int64) | The role ID. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `200 OK` — a `RoleResponse` (see the list example above). `401`
unauthenticated, `403` forbidden (missing `view:role`), `404` role not found.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/authz/roles/12?org=appscode"
```

> **Verified:** `GET /authz/roles/1?org=appscode` returned `403` against `appscode` on 2026-07-14 — the caller lacks the `view:role` relation on that role (no matching role exists in this org, so no relation is granted).

### PUT /authz/roles/{id}

Updates a role.

- **Auth:** token + `?org=` context + membership + the `edit:role` authorization relation.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `id` | integer (int64) | The role ID. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Request body:** an `UpdateRoleRequest` (all fields optional; supplied fields
replace the current values).

```json
{
  "name": "Cluster Operators",
  "description": "Can view, reconfigure and connect to clusters",
  "permissions": [
    { "namespace": "cluster_mgmt", "action": "view clusters" },
    { "namespace": "cluster_mgmt", "action": "reconfigure clusters" },
    { "namespace": "cluster_mgmt", "action": "connect to clusters" }
  ],
  "teamIDs": [7, 8]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | New display name. |
| `description` | string | no | New description. |
| `permissions` | array of `PermissionInput` | no | Replacement permission set. |
| `teamIDs` | array of integer (int64) | no | Replacement team assignments. |

**Response:** `200 OK` — the updated `RoleResponse`. `400` invalid request, `401`
unauthenticated, `403` forbidden (missing `edit:role`), `404` role not found,
`422` validation error.

### DELETE /authz/roles/{id}

Deletes a role.

- **Auth:** token + `?org=` context + membership + the `delete:role` authorization relation.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `id` | integer (int64) | The role ID. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `204 No Content` on success. `401` unauthenticated, `403` forbidden
(missing `delete:role`), `404` role not found.

---

## Role principals

### GET /authz/roles/{id}/principals

Lists the principals (users/teams) assigned to a role.

- **Auth:** token + `?org=` context + membership + the `viewer:role` authorization relation.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `id` | integer (int64) | The role ID. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing org context. |

**Response:** `200 OK` — an array. The body is the raw output of
`models.ListPrincipalsOfARole` (represented generically in the OpenAPI schema),
one entry per principal assigned to the role. `401` unauthenticated, `403`
forbidden (missing `viewer:role`).

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/authz/roles/12/principals?org=appscode"
```

> **Verified:** `GET /authz/roles/1/principals?org=appscode` returned `403` against `appscode` on 2026-07-14 — the caller lacks the `viewer:role` relation (no matching role exists in this org).
