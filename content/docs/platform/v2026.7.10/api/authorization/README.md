---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-authorization-readme
    name: Overview
    parent: api-authorization
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/authorization/
aliases:
- /docs/platform/v2026.7.10/api/authorization/overview/
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Authorization

The Authorization API exposes the KubeDB Platform's custom role management and permission
inspection, backed by the platform's relationship-based authorization model
(OpenFGA-style checks). It lets you list the permissions the caller holds on a
given object, discover the permissions that can be assigned within an
organization, and create/manage custom roles that bundle permissions and assign
them to teams.

All endpoints live under the `/api/v1/authz` prefix and require organization
context. That context is **not** taken from the path — it is supplied as a
`?org=<org-slug>` query parameter (for example `?org=appscode`). A valid token
and membership of that organization are required.

Custom role management backed by the relationship-based authorization model.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/authz/objects/:objectType/:objID/allowed-permissions` | Token + org | Allowed permissions on an object |
| POST | `/api/v1/authz/objects/allowed-permissions` | Token + org | Batch allowed-permissions query |
| GET | `/api/v1/authz/roles/available_permissions` | Token + org | List available permissions |
| GET/POST | `/api/v1/authz/roles` | Token + org (+create_role:org) | List / create roles |
| GET/PUT/DELETE | `/api/v1/authz/roles/:id` | authzCheck(view/edit/delete:role) | Manage a role |
| GET | `/api/v1/authz/roles/:id/principals` | authzCheck(viewer:role) | List principals assigned to a role |

## Pages

- [Roles & Permissions](../roles-permissions.md) — object
  allowed-permissions lookups (single and batch), the available-permissions
  catalog, role CRUD, and role principal listings.
