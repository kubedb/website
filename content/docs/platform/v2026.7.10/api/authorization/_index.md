---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-authorization
    name: Authorization
    parent: api
    weight: 40
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Authorization

The Authorization API exposes ACE's custom role management and permission
inspection, backed by the platform's relationship-based authorization model
(OpenFGA-style checks). It lets you list the permissions the caller holds on a
given object, discover the permissions that can be assigned within an
organization, and create/manage custom roles that bundle permissions and assign
them to teams.

All endpoints live under the `/api/v1/authz` prefix and require organization
context. That context is **not** taken from the path — it is supplied as a
`?org=<org-slug>` query parameter (for example `?org=appscode`). A valid token
and membership of that organization are required.

## Pages

- [Roles & Permissions](../roles-permissions.md) — object
  allowed-permissions lookups (single and batch), the available-permissions
  catalog, role CRUD, and role principal listings.
