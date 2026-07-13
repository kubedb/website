---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-multicluster-ocm
    name: Multi-cluster (OCM)
    parent: api
    weight: 70
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Multi-cluster (OCM)

APIs for Open Cluster Management (OCM) on the ACE platform: hub clusters, spoke
(managed) clusters, cluster sets, feature sets, namespace bindings, and OCM users.
A *hub* cluster runs the OCM control plane; *spoke* clusters register with it and
are then grouped into *cluster sets* on which feature sets can be installed and kept
in sync. These endpoints back the multi-cluster / hub screens of the ACE web console
and let you script the same operations against the `b3` backend.

All routes are served under the `/api/v1` prefix and are scoped to an owner and a hub
cluster: `/api/v1/clusters/{owner}/...` (owner-only, e.g. `/hubs`) or
`/api/v1/clusters/{owner}/{cluster}/...` where `{cluster}` is the hub cluster. The
`owner` is an organization or user slug; `{cluster}` is the hub cluster name. Every
endpoint authenticates with a personal access token sent as
`Authorization: token <YOUR_TOKEN>` (it may also be supplied as a `token` or
`access_token` query parameter). All routes additionally resolve the owner
organization/user and map the cluster before running; failures surface as `401`
(unauthenticated) or `403` (not authorized for the owner/cluster).

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
