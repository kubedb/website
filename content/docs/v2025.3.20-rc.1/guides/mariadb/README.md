---
title: MariaDB
menu:
  docs_v2025.3.20-rc.1:
    identifier: guides-mariadb-overview
    name: MariaDB
    parent: guides-mariadb
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
url: /docs/v2025.3.20-rc.1/guides/mariadb/
aliases:
- /docs/v2025.3.20-rc.1/guides/mariadb/README/
info:
  autoscaler: v0.37.0-rc.1
  cli: v0.53.0-rc.1
  dashboard: v0.29.0-rc.1
  installer: v2025.3.20-rc.1
  ops-manager: v0.39.0-rc.1
  provisioner: v0.53.0-rc.1
  schema-manager: v0.29.0-rc.1
  ui-server: v0.29.0-rc.1
  version: v2025.3.20-rc.1
  webhook-server: v0.29.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.3.20-rc.1/README).

## Supported MariaDB Features

| Features                                                | Availability |
|---------------------------------------------------------| :----------: |
| Clustering                                              |   &#10003;   |
| Persistent Volume                                       |   &#10003;   |
| Instant Backup                                          |   &#10003;   |
| Scheduled Backup                                        |   &#10003;   |
| Continuous Archiving using `wal-g`                      |   &#10003;   |
| Initialize using Snapshot                               |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh) |   &#10003;   |
| Custom Configuration                                    |   &#10003;   |
| Using Custom docker image                               |   &#10003;   |
| Builtin Prometheus Discovery                            |   &#10003;   |
| Using Prometheus operator                               |   &#10003;   |

## Life Cycle of a MariaDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.3.20-rc.1/guides/mariadb/images/mariadb-lifecycle.png" >
</p>

## User Guide

- [Quickstart MariaDB](/docs/v2025.3.20-rc.1/guides/mariadb/quickstart/overview) with KubeDB Operator.
- Detail concepts of [MariaDB object](/docs/v2025.3.20-rc.1/guides/mariadb/concepts/mariadb).
- Detail concepts of [MariaDBVersion object](/docs/v2025.3.20-rc.1/guides/mariadb/concepts/mariadb-version).
- Create [MariaDB Cluster](/docs/v2025.3.20-rc.1/guides/mariadb/clustering/galera-cluster).
- Create [MariaDB with Custom Configuration](/docs/v2025.3.20-rc.1/guides/mariadb/configuration/using-config-file).
- Use [Custom RBAC](/docs/v2025.3.20-rc.1/guides/mariadb/custom-rbac/using-custom-rbac).
- Use [private Docker registry](/docs/v2025.3.20-rc.1/guides/mariadb/private-registry/quickstart) to deploy MySQL with KubeDB.
- Initialize [MariaDB with Script](/docs/v2025.3.20-rc.1/guides/mariadb/initialization/using-script).
- Backup and Restore [MariaDB](/docs/v2025.3.20-rc.1/guides/mariadb/backup/stash/overview).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.3.20-rc.1/CONTRIBUTING).
