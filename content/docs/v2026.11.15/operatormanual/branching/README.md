---
title: Database Branching
menu:
  docs_v2026.11.15:
    identifier: branching
    name: Branching
    parent: operatormanual
    weight: 30
menu_name: docs_v2026.11.15
section_menu_id: operatormanual
url: /docs/v2026.11.15/operatormanual/branching/
aliases:
- /docs/v2026.11.15/operatormanual/branching/README/
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

# Database Branching

KubeDB Courier creates independent database copies from storage snapshots. A `Branch` resource describes the source database, the target, and optional steps such as password reset, post-actions, and scheduled refresh.

Start with the [overview](/docs/v2026.11.15/operatormanual/branching/overview), then configure Courier for your environment:

- [Same-cluster setup and configuration](/docs/v2026.11.15/operatormanual/branching/setup#single-cluster-installation).
- [Cross-cluster setup and configuration](/docs/v2026.11.15/operatormanual/branching/setup#cross-cluster-installation-with-ocm) with an existing Open Cluster Management (OCM) installation.

Read the feature guides for [snapshot configuration](/docs/v2026.11.15/operatormanual/branching/snapshots), [refresh](/docs/v2026.11.15/operatormanual/branching/refresh), [ResetRootPassword](/docs/v2026.11.15/operatormanual/branching/reset-root-password), and [post-actions](/docs/v2026.11.15/operatormanual/branching/post-actions).

For complete manifests and database-specific behavior, follow the [PostgreSQL branching guides](/docs/v2026.11.15/guides/postgres/branch/overview/).
