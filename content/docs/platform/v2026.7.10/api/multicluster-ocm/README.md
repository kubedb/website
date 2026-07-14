---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-multicluster-ocm-readme
    name: Overview
    parent: api-multicluster-ocm
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/multicluster-ocm/
aliases:
- /docs/platform/v2026.7.10/api/multicluster-ocm/overview/
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Multi-cluster (OCM)

APIs for Open Cluster Management (OCM) on the KubeDB Platform: hub clusters, spoke
(managed) clusters, cluster sets, feature sets, namespace bindings, and OCM users.
A *hub* cluster runs the OCM control plane; *spoke* clusters register with it and
are then grouped into *cluster sets* on which feature sets can be installed and kept
in sync. These endpoints back the multi-cluster / hub screens of the KubeDB Platform web console
and let you script the same operations against the KubeDB Platform API Server.

All routes are served under the `/api/v1` prefix and are scoped to an owner and a hub
cluster: `/api/v1/clusters/{owner}/...` (owner-only, e.g. `/hubs`) or
`/api/v1/clusters/{owner}/{cluster}/...` where `{cluster}` is the hub cluster. The
`owner` is an organization or user slug; `{cluster}` is the hub cluster name. Every
endpoint authenticates with a personal access token sent as
`Authorization: token <YOUR_TOKEN>` (it may also be supplied as a `token` or
`access_token` query parameter). All routes additionally resolve the owner
organization/user and map the cluster before running; failures surface as `401`
(unauthenticated) or `403` (not authorized for the owner/cluster).

`/api/v1/clusters/:owner/...`

Open Cluster Management operations: hubs, spokes, cluster sets, feature sets, and OCM users.
All require Token + org/user resolution + cluster mapping.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/:owner/hubs` | List hub clusters |
| POST | `/:owner/:cluster/accept-spoke` | Accept spoke clusters into the hub |
| GET | `/:owner/:cluster/{managed-clusters,not-accepted-clusters,accepted-clusters}` | Spoke inventories |
| GET | `/:owner/:cluster/validate-profile` | Validate spoke feature sets |
| GET | `/:owner/:cluster/{available-clusters,available-clustersets}` | Available managed clusters / sets |
| GET | `/:owner/:cluster/clustersets` | List cluster sets |
| POST | `/:owner/:cluster/clustersets/{add,remove,create,delete}` | Manage cluster sets |
| GET | `/:owner/:cluster/clustersets/:clusterset/{featuresets,clusters,clusterlist}` | Cluster-set contents |
| POST | `/:owner/:cluster/clustersets/:clusterset/{install-featureset,disable-featureset}` | Install / disable feature sets |
| POST | `/:owner/:cluster/clustersets/:clusterset/:managedCluster/update-featureset` | Update a managed cluster's profile binding |
| GET | `/:owner/:cluster/clustersets/:clusterset/auth-info` | Auth info of a cluster set |
| POST/GET | `/:owner/:cluster/clustersets/:clusterset/auto-update/` (+`/check`) | Enable / check auto-update |
| GET | `/:owner/:cluster/clustersets/:clusterset/sync-status/{all-features,opscenter-features-version,:feature}` | Feature sync status |
| GET | `/:owner/:cluster/bound-namespaces`, POST `/bind`, `/unbind` | Namespace ↔ cluster-set binding |
| POST | `/:owner/:cluster/spoke-command` | Generate spoke install command |
| POST | `/:owner/:cluster/import-spoke`, `/convert/spoke` | Import / convert to spoke |
| POST | `/:owner/:cluster/remove-managed-cluster` | Remove a managed cluster |
| POST | `/:owner/:cluster/sync-accounts` | Sync account objects |
| GET | `/:owner/:cluster/users` | List OCM users |
| POST | `/:owner/:cluster/user/create` | Create an OCM user |
| GET | `/:owner/:cluster/user/:id` (+`/access`, `/:spokeName/kubeconfig`) | OCM user info / access / kubeconfig |
| POST | `/:owner/:cluster/user/:id/{remove,update}`, DELETE `/user/:id/delete` | Manage OCM user permissions |

## Pages

- [Hubs & Spokes](../hubs-spokes.md) — list hub clusters, inspect
  spoke inventories (managed / accepted / not-accepted / available), accept spoke
  join requests, generate the spoke install command, import or convert a cluster to
  a spoke, remove a managed cluster, validate profiles, and sync account objects.
- [Cluster Sets & Feature Sets](../cluster-sets.md) — create,
  delete, and populate cluster sets; install/disable/update feature sets; check
  feature sync status and auto-update; and bind namespaces to cluster sets.
- [OCM Users](../ocm-users.md) — list, create, inspect, update, and
  delete OCM users and their per-cluster / per-cluster-set permissions, and fetch a
  user's kubeconfig for a spoke cluster.
