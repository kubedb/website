---
title: MySQL
menu:
  docs_v2021.03.17:
    identifier: guides-mysql-readme
    name: MySQL
    parent: guides-mysql
    weight: 10
menu_name: docs_v2021.03.17
section_menu_id: guides
url: /docs/v2021.03.17/guides/mysql/
aliases:
- /docs/v2021.03.17/guides/mysql/README/
info:
  autoscaler: v0.2.1
  cli: v0.17.1
  community: v0.17.1
  enterprise: v0.4.1
  installer: v0.17.1
  version: v2021.03.17
---

> New to KubeDB? Please start [here](/docs/v2021.03.17/README).

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
  <img alt="lifecycle"  src="/docs/v2021.03.17/images/mysql/mysql-lifecycle.png" >
</p>

## User Guide

- [Quickstart MySQL](/docs/v2021.03.17/guides/mysql/quickstart/) with KubeDB Operator.
- [Backup & Restore](/docs/v2021.03.17/guides/mysql/backup/overview/) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2021.03.17/guides/mysql/initialization/).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.03.17/guides/mysql/monitoring/prometheus-operator/).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.03.17/guides/mysql/monitoring/builtin-prometheus/).
- Use [private Docker registry](/docs/v2021.03.17/guides/mysql/private-registry/) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2021.03.17/guides/mysql/cli/) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2021.03.17/guides/mysql/concepts/database/).
- Detail concepts of [MySQLVersion object](/docs/v2021.03.17/guides/mysql/concepts/catalog/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.03.17/CONTRIBUTING).
