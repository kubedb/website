---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-client-organizations-overview
    name: Overview
    parent: api-client-organizations
    weight: 1
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
admin creates dedicated "client organizations" (a specialized kind of KubeDB Platform
organization), imports spoke clusters into them, and then manages per-cluster
user access on behalf of each client.

There are two concerns, split across two pages:

- [Client Org Management](../management) — site-admin
  lifecycle of client organizations: list/get/create/delete client orgs, add or
  remove clusters, and query client-org status. Routes live under
  `/api/v1/user/client*`.
- [Cluster User Permissions](../cluster-user-permissions)
  — organization-admin management of the OCM users belonging to a client org on
  a specific cluster: list users, create a user with permissions, inspect and
  update permissions, generate a kubeconfig, and remove a user. Routes live
  under `/api/v1/clusters/{owner}/{cluster}/permission/*`.

All routes are served under the `/api/v1` prefix and require a personal access
token (`Authorization: token <token>`). Client-org **management** routes are
site-admin only; the per-cluster **permission** routes require organization-admin
authorization on the `owner` (which must resolve to a client organization).

For managed-service providers: site admins create "client orgs" and manage per-cluster user access.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/user/clients` | Site-admin authz | List client organizations |
| GET | `/api/v1/user/client/:id` | Site-admin authz | Get a client organization |
| POST | `/api/v1/user/client/create` | authzCheck(create_client_org) | Create a client organization |
| POST | `/api/v1/user/client/:orgname/{add-cluster,delete-cluster}` | authzCheck | Add / remove a cluster |
| GET | `/api/v1/user/client/:orgname/status`, `/api/v1/user/client/:orgname/cluster/:cluster/status` | authzCheck | Client org / cluster status |
| DELETE | `/api/v1/user/client/delete/:id` | authzCheck(delete_client_org) | Delete a client organization |
| GET | `/api/v1/clusters/:owner/:cluster/permission/users` | Token + client-org | List users of a client org |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/create` | Org-admin authz | Create an OCM user for a client org |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/:id` | Org-admin authz | Get client-org user info |
| GET | `/api/v1/clusters/:owner/:cluster/permission/user/:id/kubeconfig` | Org-admin authz | Kubeconfig for a client-org user |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/:id/{remove,update}` | Org-admin authz | Manage permissions |
| DELETE | `/api/v1/clusters/:owner/:cluster/permission/user/:id/delete` | Org-admin authz | Delete the OCM user |

## Pages

- [Management](../management)
- [Cluster user permissions](../cluster-user-permissions)
