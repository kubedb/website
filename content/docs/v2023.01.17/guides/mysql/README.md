---
title: MySQL
menu:
  docs_v2023.01.17:
    identifier: guides-mysql-readme
    name: MySQL
    parent: guides-mysql
    weight: 10
menu_name: docs_v2023.01.17
section_menu_id: guides
url: /docs/v2023.01.17/guides/mysql/
aliases:
- /docs/v2023.01.17/guides/mysql/README/
info:
  autoscaler: v0.15.1
  cli: v0.30.1
  dashboard: v0.6.1
  installer: v2023.01.17
  ops-manager: v0.17.1
  provisioner: v0.30.1
  schema-manager: v0.6.1
  ui-server: v0.6.1
  version: v2023.01.17
  webhook-server: v0.6.1
---

> New to KubeDB? Please start [here](/docs/v2023.01.17/README).

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
  <img alt="lifecycle"  src="/docs/v2023.01.17/images/mysql/mysql-lifecycle.png" >
</p>

## User Guide

- [Quickstart MySQL](/docs/v2023.01.17/guides/mysql/quickstart/) with KubeDB Operator.
- [Backup & Restore](/docs/v2023.01.17/guides/mysql/backup/overview/) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2023.01.17/guides/mysql/initialization/).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2023.01.17/guides/mysql/monitoring/prometheus-operator/).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2023.01.17/guides/mysql/monitoring/builtin-prometheus/).
- Use [private Docker registry](/docs/v2023.01.17/guides/mysql/private-registry/) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2023.01.17/guides/mysql/cli/) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2023.01.17/guides/mysql/concepts/database/).
- Detail concepts of [MySQLVersion object](/docs/v2023.01.17/guides/mysql/concepts/catalog/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2023.01.17/CONTRIBUTING).
