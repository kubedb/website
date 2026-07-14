---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-upgrade-overview
    name: Overview
    parent: api-ace-upgrade
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Platform Upgrade

APIs for upgrading the KubeDB Platform itself and for upgrading the KubeDB Platform feature
stack running inside imported and spoke clusters. Upgrades are FluxCD/Helm-driven
and run asynchronously; progress and history are tracked in upgrader `ConfigMap`
data, which these endpoints surface as dynamic key/value maps.

All routes are served under the `/api/v1` prefix. Every endpoint authenticates
with a personal access token sent as `Authorization: token <YOUR_TOKEN>` (it may
also be supplied as a `token` or `access_token` query parameter).

There are two distinct authorization models, which is why the endpoints are split
across two pages:

- **Platform upgrade** routes (`/api/v1/upgrade*`) act on the KubeDB Platform as a
  whole. They require an organization context (`?org=<slug>`) and **site-admin
  organization authorization** — `view_upgrade_history:org` for the read routes
  and `upgrade_platform:org` for the trigger route.
- **Cluster upgrade** routes (`/api/v1/clusters/{owner}/{cluster}/upgrade*` and
  `.../spoke/upgrade*`) act on a specific member cluster and are gated by
  **cluster assignment** for the given owner/cluster (plus a runtime client to
  that cluster).

Platform and per-cluster upgrades (FluxCD-driven).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET/POST | `/api/v1/upgrade` | Token + org; site-admin authz (view_upgrade_history / upgrade_platform) | Platform upgrade status / trigger |
| GET | `/api/v1/upgrade/{status,history,current-version}` | Token + org; site-admin authz (view_upgrade_history) | Upgrade job status, history, current version |
| GET/POST | `/api/v1/clusters/:owner/:cluster/upgrade` | Cluster assignment + runtime client | Imported-cluster upgrade status / trigger |
| GET | `/api/v1/clusters/:owner/:cluster/upgrade/{history,current-version,latest-version}` | Cluster assignment + runtime client | Upgrade info |
| GET/POST | `/api/v1/clusters/:owner/:cluster/spoke/upgrade` (+`/history`) | Cluster assignment + runtime client | Spoke-cluster upgrade status / trigger / history |

## Pages

- [Platform Upgrade](../platform-upgrade) — the
  `/api/v1/upgrade*` endpoints: platform upgrade status, job status, history, and
  current version, plus triggering a platform upgrade. Requires site-admin org
  authorization.
- [Cluster Upgrade](../cluster-upgrade) — the
  `/api/v1/clusters/{owner}/{cluster}/upgrade*` and `.../spoke/upgrade*`
  endpoints: imported-cluster and spoke-cluster upgrade status, history, current
  and latest versions, plus triggering cluster/spoke upgrades. Gated by cluster
  assignment.
