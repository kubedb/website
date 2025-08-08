---
title: MariaDB
menu:
  docs_v2021.03.11:
    identifier: guides-mariadb-overview
    name: MariaDB
    parent: guides-mariadb
    weight: 10
menu_name: docs_v2021.03.11
section_menu_id: guides
info:
  autoscaler: v0.2.0
  cli: v0.17.0
  community: v0.17.0
  enterprise: v0.4.0
  installer: v0.17.0
  release: v2021.03.11
  version: v2021.03.11
---

> New to KubeDB? Please start [here](/docs/v2021.03.11/README).

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
  <img alt="lifecycle"  src="/docs/v2021.03.11/guides/mariadb/images/mariadb-lifecycle.png" >
</p>

## User Guide

- [Quickstart MariaDB](/docs/v2021.03.11/guides/mariadb/quickstart/overview) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.03.11/CONTRIBUTING).
