---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-client-organizations
    name: Client Organizations
    parent: api
    weight: 80
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Client Organizations

These endpoints support the **managed-service-provider** model. A platform site
admin creates dedicated "client organizations" (a specialized kind of ACE
organization), imports spoke clusters into them, and then manages per-cluster
user access on behalf of each client.

There are two concerns, split across two pages:

- [Client Org Management](../management.md) — site-admin
  lifecycle of client organizations: list/get/create/delete client orgs, add or
  remove clusters, and query client-org status. Routes live under
  `/api/v1/user/client*`.
- [Cluster User Permissions](../cluster-user-permissions.md)
  — organization-admin management of the OCM users belonging to a client org on
  a specific cluster: list users, create a user with permissions, inspect and
  update permissions, generate a kubeconfig, and remove a user. Routes live
  under `/api/v1/clusters/{owner}/{cluster}/permission/*`.

All routes are served under the `/api/v1` prefix and require a personal access
token (`Authorization: token <token>`). Client-org **management** routes are
site-admin only; the per-cluster **permission** routes require organization-admin
authorization on the `owner` (which must resolve to a client organization).
