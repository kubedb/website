---
title: PerconaXtraDB
menu:
  docs_v2023.06.19:
    identifier: guides-perconaxtradb-overview
    name: PerconaXtraDB
    parent: guides-perconaxtradb
    weight: 10
menu_name: docs_v2023.06.19
section_menu_id: guides
url: /docs/v2023.06.19/guides/percona-xtradb/
aliases:
- /docs/v2023.06.19/guides/percona-xtradb/README/
info:
  autoscaler: v0.19.0
  cli: v0.34.0
  dashboard: v0.10.0
  installer: v2023.06.19
  ops-manager: v0.21.0
  provisioner: v0.34.0
  schema-manager: v0.10.0
  ui-server: v0.10.0
  version: v2023.06.19
  webhook-server: v0.10.0
---

> New to KubeDB? Please start [here](/docs/v2023.06.19/README).

## Supported PerconaXtraDB Features

| Features                                                | Availability |
| ------------------------------------------------------- | :----------: |
| Clustering                                              |   &#10003;   |
| Persistent Volume                                       |   &#10003;   |
| Instant Backup                                          |   &#10003;   |
| Scheduled Backup                                        |   &#10003;   |
| Initialize using Snapshot                               |   &#10003;   |
| Custom Configuration                                    |   &#10003;   |
| Using Custom docker image                               |   &#10003;   |
| Builtin Prometheus Discovery                            |   &#10003;   |
| Using Prometheus operator                               |   &#10003;   |

## Life Cycle of a PerconaXtraDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2023.06.19/guides/percona-xtradb/images/perconaxtradb-lifecycle.svg" >
</p>

## User Guide

- [Quickstart PerconaXtraDB](/docs/v2023.06.19/guides/percona-xtradb/quickstart/overview) with KubeDB Operator.
- Detail concepts of [PerconaXtraDB object](/docs/v2023.06.19/guides/percona-xtradb/concepts/perconaxtradb).
- Detail concepts of [PerconaXtraDBVersion object](/docs/v2023.06.19/guides/percona-xtradb/concepts/perconaxtradb-version).
- Create [PerconaXtraDB Cluster](/docs/v2023.06.19/guides/percona-xtradb/clustering/galera-cluster).
- Create [PerconaXtraDB with Custom Configuration](/docs/v2023.06.19/guides/percona-xtradb/configuration/using-config-file).
- Use [Custom RBAC](/docs/v2023.06.19/guides/percona-xtradb/custom-rbac/using-custom-rbac).
- Use [private Docker registry](/docs/v2023.06.19/guides/percona-xtradb/private-registry/quickstart) to deploy MySQL with KubeDB.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2023.06.19/CONTRIBUTING).
