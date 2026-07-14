---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v2-readme
    name: Overview
    parent: api-cluster-management-v2
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/cluster-management-v2/
aliases:
- /docs/platform/v2026.7.10/api/cluster-management-v2/overview/
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
- **Gateway configurations** — list gateway configs and update them to the current KubeDB Platform
  chart version.
- **vcluster support** — create or import virtual clusters on a host cluster.
- **Inbox subscriptions** — subscribe the current user to cluster-, namespace-, or
  resource-level inbox notifications, plus obtain an inbox agent token for a cluster.

All routes require a personal access token (`Authorization: token <t>`). Most routes are
scoped to an `owner` (organization slug or username) and, for cluster-scoped routes, a
`cluster` name; a few (skip-credentials, all-hubs, identity, all-clusters) require
site-admin privileges.

`/api/v1/clustersv2`

Newer cluster API with hub awareness, subscriptions (inbox notifications), gateway config, and
vcluster support. All routes require Token.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/providers/:provider/skip-credentials` | Check if provider credentials can be skipped |
| GET | `/all-hubs` | List all hub clusters |
| GET | `/:owner/all-clusters` | List imported clusters (site admin) |
| GET | `/identity/:clusterID` | Get cluster identity |
| GET | `/cluster-profiles` | Get cluster profiles |
| GET | `/:owner/` | List clusters |
| GET | `/:owner/hub-info`, `/:owner/has-hub` | Hub cluster info / existence |
| GET | `/:owner/:cluster/exist` | Check if cluster is imported |
| GET | `/:owner/:cluster/status` | Get cluster status |
| GET | `/:owner/:cluster/reconcile` | Reconcile Helm release |
| POST | `/:owner/:cluster/connect`, `/remove` | Connect / remove a cluster |
| GET | `/:owner/:cluster/update-version/{operations,list,:version}` | Kubernetes version upgrade info / trigger |
| GET/PUT | `/:owner/:cluster/gateway-configs` | View (GET) / update-all (PUT) gateway configs |
| PUT | `/:owner/:cluster/gateway-configs/:namespace/:name` | Update a single gateway config |
| POST | `/:owner/:cluster/reconfigure` | Reconfigure a cluster |
| POST | `/:owner/:cluster/feature/:feature/convert` | Convert a feature |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/` | Cluster-level notification subscription |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/namespaces/:namespace/` | Namespace-level subscription |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/namespaces/:namespace/:group/:version/:resource/:resourceName` | Resource-level subscription |
| POST | `/:owner/check`, `/:owner/validate` | Check existence / validate import options |
| POST | `/:owner/import` | Import a cluster |
| POST | `/:owner/vcluster/create`, `/:owner/vcluster/import` | Create / import a virtual cluster |

Related: `GET /api/v1/agent/:clusterName/:clusterID/token` (Token) — inbox agent token for a cluster.

## Pages

- [Clusters](../clusters.md) — providers, hubs, cluster identity,
  listing, status, import/connect/remove, reconcile, reconfigure, Kubernetes version
  upgrades, gateway configs, feature conversion, and vclusters.
- [Subscriptions & Inbox](../subscriptions.md) — cluster,
  namespace, and resource notification subscriptions, plus the inbox agent token.
