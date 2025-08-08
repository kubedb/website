---
title: MySQL
menu:
  docs_v2022.10.18:
    identifier: guides-mysql-readme
    name: MySQL
    parent: guides-mysql
    weight: 10
menu_name: docs_v2022.10.18
section_menu_id: guides
url: /docs/v2022.10.18/guides/mysql/
aliases:
- /docs/v2022.10.18/guides/mysql/README/
info:
  autoscaler: v0.14.0
  cli: v0.29.0
  dashboard: v0.5.0
  installer: v2022.10.18
  ops-manager: v0.16.0
  provisioner: v0.29.0
  schema-manager: v0.5.0
  ui-server: v0.5.0
  version: v2022.10.18
  webhook-server: v0.5.0
---

> New to KubeDB? Please start [here](/docs/v2022.10.18/README).

## Supported MySQL Features

| Features                                                                                | Availability |
| --------------------------------------------------------------------------------------- | :----------: |
| Group Replication                                                                       |   &#10003;   |
| Innodb Cluster                                                                          |   &#10003;   |
| SemiSynchronous cluster                                                                 |   &#10003;   |
| Read Replicas                                                                           |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) )      |   &#10003;   |
| Automated Version Upgrade                                                               |   &#10003;   |
| Automatic Vertical Scaling                                                              |   &#10003;   |
| Automated Horizontal Scaling                                                            |   &#10003;   |
| Automated Volume Expansion                                                              |   &#10003;   |
| Backup/Recovery: Instant, Scheduled ( [Stash](https://stash.run/) )                     |   &#10003;   |
| Initialize using Snapshot                                                               |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh)                                 |   &#10003;   |
| Custom Configuration                                                                    |   &#10003;   |
| Using Custom docker image                                                               |   &#10003;   |
| Builtin Prometheus Discovery                                                            |   &#10003;   |
| Using Prometheus operator                                                               |   &#10003;   |

## Life Cycle of a MySQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2022.10.18/images/mysql/mysql-lifecycle.png" >
</p>

## User Guide

- [Quickstart MySQL](/docs/v2022.10.18/guides/mysql/quickstart/) with KubeDB Operator.
- [Backup & Restore](/docs/v2022.10.18/guides/mysql/backup/overview/) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2022.10.18/guides/mysql/initialization/).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2022.10.18/guides/mysql/monitoring/prometheus-operator/).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2022.10.18/guides/mysql/monitoring/builtin-prometheus/).
- Use [private Docker registry](/docs/v2022.10.18/guides/mysql/private-registry/) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2022.10.18/guides/mysql/cli/) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2022.10.18/guides/mysql/concepts/database/).
- Detail concepts of [MySQLVersion object](/docs/v2022.10.18/guides/mysql/concepts/catalog/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.10.18/CONTRIBUTING).
