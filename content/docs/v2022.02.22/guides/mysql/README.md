---
title: MySQL
menu:
  docs_v2022.02.22:
    identifier: guides-mysql-readme
    name: MySQL
    parent: guides-mysql
    weight: 10
menu_name: docs_v2022.02.22
section_menu_id: guides
url: /docs/v2022.02.22/guides/mysql/
aliases:
- /docs/v2022.02.22/guides/mysql/README/
info:
  autoscaler: v0.10.0
  cli: v0.25.0
  community: v0.25.0
  dashboard: v0.1.0
  enterprise: v0.12.0
  installer: v2022.02.22
  schema-manager: v0.1.0
  ui-server: v0.1.0
  version: v2022.02.22
  webhook-server: v0.1.0
---

> New to KubeDB? Please start [here](/docs/v2022.02.22/README).

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
  <img alt="lifecycle"  src="/docs/v2022.02.22/images/mysql/mysql-lifecycle.png" >
</p>

## User Guide

- [Quickstart MySQL](/docs/v2022.02.22/guides/mysql/quickstart/) with KubeDB Operator.
- [Backup & Restore](/docs/v2022.02.22/guides/mysql/backup/overview/) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2022.02.22/guides/mysql/initialization/).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2022.02.22/guides/mysql/monitoring/prometheus-operator/).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2022.02.22/guides/mysql/monitoring/builtin-prometheus/).
- Use [private Docker registry](/docs/v2022.02.22/guides/mysql/private-registry/) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2022.02.22/guides/mysql/cli/) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2022.02.22/guides/mysql/concepts/database/).
- Detail concepts of [MySQLVersion object](/docs/v2022.02.22/guides/mysql/concepts/catalog/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.02.22/CONTRIBUTING).
