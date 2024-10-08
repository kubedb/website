---
title: MariaDB
menu:
  docs_v2024.8.14-rc.3:
    identifier: guides-mariadb-overview
    name: MariaDB
    parent: guides-mariadb
    weight: 10
menu_name: docs_v2024.8.14-rc.3
section_menu_id: guides
url: /docs/v2024.8.14-rc.3/guides/mariadb/
aliases:
- /docs/v2024.8.14-rc.3/guides/mariadb/README/
info:
  autoscaler: v0.32.0-rc.3
  cli: v0.47.0-rc.3
  dashboard: v0.23.0-rc.3
  installer: v2024.8.14-rc.3
  ops-manager: v0.34.0-rc.3
  provisioner: v0.47.0-rc.3
  schema-manager: v0.23.0-rc.3
  ui-server: v0.23.0-rc.3
  version: v2024.8.14-rc.3
  webhook-server: v0.23.0-rc.3
---

> New to KubeDB? Please start [here](/docs/v2024.8.14-rc.3/README).

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
  <img alt="lifecycle"  src="/docs/v2024.8.14-rc.3/guides/mariadb/images/mariadb-lifecycle.png" >
</p>

## User Guide

- [Quickstart MariaDB](/docs/v2024.8.14-rc.3/guides/mariadb/quickstart/overview) with KubeDB Operator.
- Detail concepts of [MariaDB object](/docs/v2024.8.14-rc.3/guides/mariadb/concepts/mariadb).
- Detail concepts of [MariaDBVersion object](/docs/v2024.8.14-rc.3/guides/mariadb/concepts/mariadb-version).
- Create [MariaDB Cluster](/docs/v2024.8.14-rc.3/guides/mariadb/clustering/galera-cluster).
- Create [MariaDB with Custom Configuration](/docs/v2024.8.14-rc.3/guides/mariadb/configuration/using-config-file).
- Use [Custom RBAC](/docs/v2024.8.14-rc.3/guides/mariadb/custom-rbac/using-custom-rbac).
- Use [private Docker registry](/docs/v2024.8.14-rc.3/guides/mariadb/private-registry/quickstart) to deploy MySQL with KubeDB.
- Initialize [MariaDB with Script](/docs/v2024.8.14-rc.3/guides/mariadb/initialization/using-script).
- Backup and Restore [MariaDB](/docs/v2024.8.14-rc.3/guides/mariadb/backup/overview).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.8.14-rc.3/CONTRIBUTING).
