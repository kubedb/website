---
title: MySQL
menu:
  docs_v2021.03.11:
    identifier: my-readme-mysql
    name: MySQL
    parent: my-mysql-guides
    weight: 10
menu_name: docs_v2021.03.11
section_menu_id: guides
url: /docs/v2021.03.11/guides/mysql/
aliases:
- /docs/v2021.03.11/guides/mysql/README/
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

## Supported MySQL Features

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

## Life Cycle of a MySQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2021.03.11/images/mysql/mysql-lifecycle.png" >
</p>

## User Guide

- [Quickstart MySQL](/docs/v2021.03.11/guides/mysql/quickstart/quickstart) with KubeDB Operator.
- [Backup & Restore](/docs/v2021.03.11/guides/mysql/backup/stash) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2021.03.11/guides/mysql/initialization/using-script).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.03.11/guides/mysql/monitoring/using-prometheus-operator).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.03.11/guides/mysql/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.03.11/guides/mysql/private-registry/using-private-registry) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2021.03.11/guides/mysql/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2021.03.11/guides/mysql/concepts/mysql).
- Detail concepts of [MySQLVersion object](/docs/v2021.03.11/guides/mysql/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.03.11/CONTRIBUTING).
