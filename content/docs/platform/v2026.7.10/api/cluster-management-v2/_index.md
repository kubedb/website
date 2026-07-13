---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v2
    name: Cluster Management v2
    parent: api
    weight: 60
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster Management v2

The Cluster Management v2 API is the newer, hub-aware cluster surface served under
`/api/v1/clustersv2`. It builds on [Cluster Management v1](../../cluster-management-v1/)
and adds:

- **Hub awareness** — list hub clusters, resolve hub connection info, and check hub
  presence for an owner (Open Cluster Management, or OCM, integration).
- **Import & lifecycle** — check/validate/import clusters, connect or re-connect to an
  already-imported cluster, reconcile Helm releases, reconfigure components, and remove
  a cluster.
- **Kubernetes version upgrades** — inspect upgradeable versions and trigger CAPI
  cluster upgrades.
- **Gateway configurations** — list gateway configs and update them to the current ACE
  chart version.
- **vcluster support** — create or import virtual clusters on a host cluster.
- **Inbox subscriptions** — subscribe the current user to cluster-, namespace-, or
  resource-level inbox notifications, plus obtain an inbox agent token for a cluster.

All routes require a personal access token (`Authorization: token <t>`). Most routes are
scoped to an `owner` (organization slug or username) and, for cluster-scoped routes, a
`cluster` name; a few (skip-credentials, all-hubs, identity, all-clusters) require
site-admin privileges.

## Pages

- [Clusters](../clusters.md) — providers, hubs, cluster identity,
  listing, status, import/connect/remove, reconcile, reconfigure, Kubernetes version
  upgrades, gateway configs, feature conversion, and vclusters.
- [Subscriptions & Inbox](../subscriptions.md) — cluster,
  namespace, and resource notification subscriptions, plus the inbox agent token.
