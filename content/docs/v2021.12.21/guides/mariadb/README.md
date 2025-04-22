---
title: MariaDB
menu:
  docs_v2021.12.21:
    identifier: guides-mariadb-overview
    name: MariaDB
    parent: guides-mariadb
    weight: 10
menu_name: docs_v2021.12.21
section_menu_id: guides
url: /docs/v2021.12.21/guides/mariadb/
aliases:
- /docs/v2021.12.21/guides/mariadb/README/
info:
  autoscaler: v0.9.2
  cli: v0.24.0
  community: v0.24.2
  enterprise: v0.11.2
  installer: v2021.12.21
  version: v2021.12.21
---

> New to KubeDB? Please start [here](/docs/v2021.12.21/README).

## Supported MariaDB Features

| Features                                                | Availability |
| ------------------------------------------------------- | :----------: |
| Clustering                                              |   &#10003;   |
| Persistent Volume                                       |   &#10003;   |
| Instant Backup                                          |   &#10003;   |
| Scheduled Backup                                        |   &#10003;   |
| Initialize using Snapshot                               |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh) |   &#10003;   |
| Custom Configuration                                    |   &#10003;   |
| Using Custom docker image                               |   &#10003;   |
| Builtin Prometheus Discovery                            |   &#10003;   |
| Using Prometheus operator                               |   &#10003;   |

## Life Cycle of a MariaDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2021.12.21/guides/mariadb/images/mariadb-lifecycle.png" >
</p>

## User Guide

- [Quickstart MariaDB](/docs/v2021.12.21/guides/mariadb/quickstart/overview) with KubeDB Operator.
- Detail concepts of [MariaDB object](/docs/v2021.12.21/guides/mariadb/concepts/mariadb).
- Detail concepts of [MariaDBVersion object](/docs/v2021.12.21/guides/mariadb/concepts/mariadb-version).
- Create [MariaDB Cluster](/docs/v2021.12.21/guides/mariadb/clustering/galera-cluster).
- Create [MariaDB with Custom Configuration](/docs/v2021.12.21/guides/mariadb/configuration/using-config-file).
- Use [Custom RBAC](/docs/v2021.12.21/guides/mariadb/custom-rbac/using-custom-rbac).
- Use [private Docker registry](/docs/v2021.12.21/guides/mariadb/private-registry/quickstart) to deploy MySQL with KubeDB.
- Initialize [MariaDB with Script](/docs/v2021.12.21/guides/mariadb/initialization/using-script).
- Backup and Restore [MariaDB](/docs/v2021.12.21/guides/mariadb/backup/overview).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.12.21/CONTRIBUTING).
